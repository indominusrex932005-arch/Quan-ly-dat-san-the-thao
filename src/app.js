import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import { ZodError } from 'zod';
import { createCatalog } from './services/catalog.js';
import { makeSlots, quoteSelection, vietnamDate, RuleError } from './domain/booking-rules.js';
import { quoteRequestSchema } from './domain/validation.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function createApp({ demo = true, clock = () => new Date(), databaseReady = () => false } = {}) {
  const app = express();
  const catalog = createCatalog(demo);
  app.disable('x-powered-by');
  app.use(helmet());
  // Trang lỗi vẫn cần các biến này khi parser dừng request trước khi vào route.
  app.use((_req, res, next) => {
    res.locals.demo = demo;
    res.locals.currency = value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    next();
  });
  app.use(express.urlencoded({ extended: false, limit: '20kb' }));
  app.use(express.json({ limit: '20kb' }));
  app.set('view engine', 'ejs');
  app.set('views', path.join(root, 'views'));
  app.use('/assets', express.static(path.join(root, 'public')));
  app.use('/vendor/bootstrap', express.static(path.join(root, 'node_modules/bootstrap/dist/css')));

  app.get('/health', (_req, res) => res.json({ status: 'ok', mode: demo ? 'demo' : 'mongodb', databaseConnected: databaseReady() }));
  app.get('/', async (_req, res) => res.render('home', { facilities: await catalog.facilities() }));
  app.get('/facilities/:id', async (req, res) => {
    const facility = await catalog.facility(req.params.id);
    if (!facility) return res.status(404).render('error', { message: 'Không tìm thấy cơ sở.' });
    res.render('facility', { facility, courts: await catalog.courts(req.params.id) });
  });
  app.get('/courts/:id', async (req, res) => {
    const court = await catalog.court(req.params.id);
    if (!court) return res.status(404).render('error', { message: 'Không tìm thấy sân.' });
    const date = req.query.date || vietnamDate(clock());
    const locks = await catalog.locks(court._id, date, clock());
    res.render('court', { court, facility: await catalog.facility(String(court.facilityId)), date,
      slots: makeSlots(court, date, locks, clock()) });
  });
  app.post('/quotes', async (req, res) => {
    const body = req.body ?? {};
    const times = body.times === undefined ? [] : Array.isArray(body.times) ? body.times : [body.times];
    const input = quoteRequestSchema.parse({ courtId: body.courtId, date: body.date, times,
      guest: { name: body.name, phone: body.phone } });
    const court = await catalog.court(input.courtId);
    if (!court) return res.status(404).render('error', { message: 'Không tìm thấy sân.' });
    const locks = await catalog.locks(court._id, input.date, clock());
    const quote = quoteSelection(court, input.date, input.times, locks, clock());
    // Chỉ báo giá để xem UI. Chưa tạo booking, chưa giữ chỗ, chưa nhận tiền.
    res.render('quote', { guest: input.guest, court, facility: await catalog.facility(String(court.facilityId)), date: input.date, quote });
  });
  app.get('/owner/login', (_req, res) => res.render('owner-login'));

  app.get('/api/facilities', async (_req, res) => res.json({ demo, data: await catalog.facilities() }));
  app.get('/api/facilities/:id/courts', async (req, res) => {
    if (!await catalog.facility(req.params.id)) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Không tìm thấy cơ sở.' } });
    res.json({ demo, data: await catalog.courts(req.params.id) });
  });
  app.get('/api/courts/:id/availability', async (req, res) => {
    const court = await catalog.court(req.params.id);
    if (!court) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Không tìm thấy sân.' } });
    const date = req.query.date || vietnamDate(clock());
    res.json({ demo, date, data: makeSlots(court, date, await catalog.locks(court._id, date, clock()), clock()) });
  });
  app.post('/api/quotes', async (req, res) => {
    const input = quoteRequestSchema.parse(req.body);
    const court = await catalog.court(input.courtId);
    if (!court) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Không tìm thấy sân.' } });
    const quote = quoteSelection(court, input.date, input.times, await catalog.locks(court._id, input.date, clock()), clock());
    res.json({ demo, holdsSlots: false, guest: input.guest, courtId: String(court._id), date: input.date, ...quote });
  });
  app.use('/api', (_req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'API không tồn tại.' } }));
  app.use((_req, res) => res.status(404).render('error', { message: 'Trang không tồn tại.' }));
  app.use((error, req, res, _next) => {
    const validation = error instanceof RuleError || error instanceof ZodError;
    const status = validation ? 400
      : Number.isInteger(error.status) && error.status >= 400 && error.status < 500 ? error.status : 500;
    const code = status === 400 ? 'VALIDATION_ERROR' : status === 413 ? 'PAYLOAD_TOO_LARGE'
      : status === 404 ? 'NOT_FOUND' : status === 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR';
    const message = error instanceof ZodError ? error.issues.map(item => item.message).join(' ')
      : status === 413 ? 'Dữ liệu gửi lên vượt quá giới hạn 20 KB.'
        : error.type === 'entity.parse.failed' ? 'Dữ liệu JSON không hợp lệ.'
          : status < 500 ? error.message : 'Có lỗi xử lý. Vui lòng thử lại.';
    if (status === 500) console.error('Request failed:', error.name);
    if (req.path === '/api' || req.path.startsWith('/api/')) return res.status(status).json({ error: { code, message } });
    res.status(status).render('error', { message });
  });
  return app;
}
