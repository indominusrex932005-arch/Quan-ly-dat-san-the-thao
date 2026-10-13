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
  it('form báo giá nhận một ô đơn lẻ và tính đúng 30 phút, 40.000đ', async () => {
    const response = await request(app).post('/quotes').type('form').send({
      courtId: payload.courtId,
      date: payload.date,
      times: '16:30',
      name: payload.guest.name,
      phone: payload.guest.phone,
    });
    expect(response.status).toBe(200);
    expect(response.text).toContain('16:30–17:00');
    expect(response.text).toContain('30 phút');
    expect(response.text).toContain(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(40000));
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

describe('Xử lý đầu vào và lỗi HTTP', () => {
  it('API báo giá trả 400 khi không có body', async () => {
    const response = await request(app).post('/api/quotes');
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('form báo giá trả trang lỗi 400 khi không có body', async () => {
    const response = await request(app).post('/quotes');
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/text\/html/);
    expect(response.text).toContain('<h1 class="h4">Không thực hiện được thao tác</h1>');
  });

  it('API trả 413 và mã lỗi rõ ràng khi JSON vượt 20KB', async () => {
    const response = await request(app).post('/api/quotes').send({
      ...payload,
      guest: { ...payload.guest, name: 'a'.repeat(21 * 1024) },
    });
    expect(response.status).toBe(413);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body.error.code).toBe('PAYLOAD_TOO_LARGE');
  });

  it.each(['get', 'post'])('API không tồn tại trả JSON 404 với method %s', async method => {
    const response = await request(app)[method]('/api/khong-co');
    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });

  it('đường dẫn /api cũng trả JSON 404', async () => {
    const response = await request(app).get('/api');
    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });

  it('JSON hỏng ở trang báo giá vẫn render trang lỗi 400 của ứng dụng', async () => {
    const response = await request(app).post('/quotes').type('json').send('{invalid');
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/text\/html/);
    expect(response.text).toContain('<h1 class="h4">Không thực hiện được thao tác</h1>');
    expect(response.text).not.toContain('demo is not defined');
    expect(response.text).not.toContain('ReferenceError');
    expect(response.text).not.toContain('/workspace/');
  });

  it('form vượt 20KB vẫn render trang lỗi 413 của ứng dụng', async () => {
    const response = await request(app).post('/quotes').type('form').send({
      courtId: payload.courtId,
      date: payload.date,
      times: payload.times,
      name: 'a'.repeat(21 * 1024),
      phone: payload.guest.phone,
    });
    expect(response.status).toBe(413);
    expect(response.headers['content-type']).toMatch(/text\/html/);
    expect(response.text).toContain('<h1 class="h4">Không thực hiện được thao tác</h1>');
    expect(response.text).not.toContain('demo is not defined');
    expect(response.text).not.toContain('ReferenceError');
    expect(response.text).not.toContain('/workspace/');
  });

  it.each([{}, { ...payload, courtId: { id: payload.courtId } }])(
    'API báo giá trả 400 khi request sai cấu trúc: %j', async body => {
      const response = await request(app).post('/api/quotes').send(body);
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    },
  );
});
