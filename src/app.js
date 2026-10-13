import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import { ZodError } from 'zod';
import { createCatalog } from './services/catalog.js';
import { makeSlots, quoteSelection, vietnamDate, RuleError } from './domain/booking-rules.js';
import { guestSchema } from './domain/validation.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function createApp({ demo = true, clock = () => new Date(), databaseReady = () => false } = {}) {
  const app = express();
  const catalog = createCatalog(demo);
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(express.urlencoded({ extended: false, limit: '20kb' }));
  app.use(express.json({ limit: '20kb' }));
  app.set('view engine', 'ejs');
  app.set('views', path.join(root, 'views'));
  app.use('/assets', express.static(path.join(root, 'public')));
  app.use('/vendor/bootstrap', express.static(path.join(root, 'node_modules/bootstrap/dist/css')));
  app.use((_req, res, next) => {
    res.locals.demo = demo;
    res.locals.currency = value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    next();
  });

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
    const court = await catalog.court(req.body.courtId);
    if (!court) return res.status(404).render('error', { message: 'Không tìm thấy sân.' });
    const guest = guestSchema.parse({ name: req.body.name, phone: req.body.phone });
    const times = Array.isArray(req.body.times) ? req.body.times : req.body.times ? [req.body.times] : [];
    const locks = await catalog.locks(court._id, req.body.date, clock());
    const quote = quoteSelection(court, req.body.date, times, locks, clock());
    // Chỉ báo giá để xem UI. Chưa tạo booking, chưa giữ chỗ, chưa nhận tiền.
    res.render('quote', { guest, court, facility: await catalog.facility(String(court.facilityId)), date: req.body.date, quote });
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
    const court = await catalog.court(req.body.courtId);
    if (!court) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Không tìm thấy sân.' } });
    const guest = guestSchema.parse(req.body.guest);
    const quote = quoteSelection(court, req.body.date, req.body.times, await catalog.locks(court._id, req.body.date, clock()), clock());
    res.json({ demo, holdsSlots: false, guest, courtId: String(court._id), date: req.body.date, ...quote });
  });
  app.use((_req, res) => res.status(404).render('error', { message: 'Trang không tồn tại.' }));
  app.use((error, req, res, _next) => {
    const validation = error instanceof RuleError || error instanceof ZodError;
    const status = validation ? 400 : error.status === 400 ? 400 : 500;
    const message = error instanceof ZodError ? error.issues.map(item => item.message).join(' ')
      : status === 400 ? error.message : 'Có lỗi xử lý. Vui lòng thử lại.';
    if (status === 500) console.error('Request failed:', error.name);
    if (req.path.startsWith('/api/')) return res.status(status).json({ error: { code: status === 400 ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR', message } });
    res.status(status).render('error', { message });
  });
  return app;
}
