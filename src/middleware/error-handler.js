import { ZodError } from 'zod';
import { RuleError } from '../domain/booking-rules.js';

export function apiNotFound(_req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'API không tồn tại.' } });
}

export function pageNotFound(_req, res) {
  res.status(404).render('error', { message: 'Trang không tồn tại.' });
}

export function errorHandler(error, req, res, _next) {
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
}
