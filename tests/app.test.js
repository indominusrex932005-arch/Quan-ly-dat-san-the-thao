import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadConfig } from '../src/config.js';
import { guestSchema } from '../src/domain/validation.js';

const app = createApp({ clock: () => new Date('2026-11-10T05:00:00+07:00') });
const payload = { courtId: 'san-mau-1', date: '2026-11-10', times: ['16:30', '19:30'], guest: { name: 'Khách mẫu', phone: '0912345678' } };

describe('Trang và API khởi đầu', () => {
  it('trang chủ ghi rõ dữ liệu mẫu', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('dữ liệu mẫu');
    expect(response.text).toContain('Cơ sở cầu lông mẫu 2');
  });
  it('render trang cơ sở, sân và giao diện đăng nhập', async () => {
    for (const url of ['/facilities/co-so-mau-1', '/courts/san-mau-1?date=2026-11-10', '/owner/login']) {
      expect((await request(app).get(url)).status).toBe(200);
    }
  });
  it('health không giả vờ đã kết nối database', async () => {
    expect((await request(app).get('/health')).body).toMatchObject({ mode: 'demo', databaseConnected: false });
  });
  it('API chỉ trả sân trong cơ sở đã chọn', async () => {
    const response = await request(app).get('/api/facilities/co-so-mau-1/courts');
    expect(response.body.data.map(court => court._id)).toEqual(['san-mau-1', 'san-mau-2']);
  });
  it('lịch phân biệt booked, locked và trống', async () => {
    const response = await request(app).get('/api/courts/san-mau-1/availability?date=2026-11-10');
    expect(response.body.data.find(slot => slot.time === '18:00').status).toBe('BOOKED');
    expect(response.body.data.find(slot => slot.time === '19:00').status).toBe('LOCKED');
    expect(response.body.data.find(slot => slot.time === '19:30').status).toBe('AVAILABLE');
  });
  it('backend tính lại giá, không nhận giá do khách gửi', async () => {
    const response = await request(app).post('/api/quotes').send({ ...payload, totalPriceVND: 1 });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ totalPriceVND: 100000, totalMinutes: 60, holdsSlots: false });
  });
  it('không báo giá khi có ô đã booked', async () => {
    expect((await request(app).post('/api/quotes').send({ ...payload, times: ['18:00'] })).status).toBe(400);
  });
  it('kiểm tra tên và số điện thoại', async () => {
    expect((await request(app).post('/api/quotes').send({ ...payload, guest: { name: '', phone: '123' } })).status).toBe(400);
    expect(guestSchema.parse({ name: 'Khách mẫu', phone: '+84 912 345 678' }).phone).toBe('0912345678');
  });
  it('render xác nhận các ô rời nhau và escape tên khách', async () => {
    const response = await request(app).post('/quotes').type('form').send({ courtId: payload.courtId, date: payload.date, times: payload.times, name: '<script>alert(1)</script>', phone: '0912345678' });
    expect(response.status).toBe(200);
    expect(response.text).toContain('16:30–17:00');
    expect(response.text).toContain('19:30–20:00');
    expect(response.text).not.toContain('<script>alert(1)</script>');
  });
  it('từ chối ngày không hợp lệ và sân không có', async () => {
    expect((await request(app).get('/api/courts/san-mau-1/availability?date=2026-02-30')).status).toBe(400);
    expect((await request(app).get('/courts/khong-co')).status).toBe(404);
  });
  it('production không được chạy demo hoặc thiếu database', () => {
    expect(() => loadConfig({ NODE_ENV: 'production', DEMO_MODE: 'true' })).toThrow();
    expect(() => loadConfig({ NODE_ENV: 'production', DEMO_MODE: 'false' })).toThrow();
  });
});
