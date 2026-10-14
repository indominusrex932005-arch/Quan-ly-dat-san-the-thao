import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const form = { courtId: 'san-mau-1', date: '2026-11-10', times: ['16:30', '19:30'],
  name: 'Khách thử', phone: '0912345678' };

function setup() {
  let now = new Date('2026-11-10T05:00:00+07:00');
  const app = createApp({ clock: () => now });
  return { app, advance: minutes => { now = new Date(now.getTime() + minutes * 60000); } };
}

async function checkout(app, body = form) {
  const response = await request(app).post('/demo/checkout').type('form').send(body);
  expect(response.status).toBe(303);
  expect(response.headers.location).toMatch(/^\/demo\/payment\/[a-f0-9]{48}$/);
  return response.headers.location.split('/').at(-1);
}

describe('Luồng thử giao diện, tách khỏi đặt sân thật', () => {
  it('backend tính lại báo giá khi mở trang thanh toán mẫu, không nhận giá khách gửi', async () => {
    const { app } = setup();
    const token = await checkout(app, { ...form, totalPriceVND: 1 });
    const page = await request(app).get('/demo/payment/' + token);
    expect(page.status).toBe(200);
    expect(page.text).toContain(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(100000));
    expect(page.text).toContain('16:30');
    expect(page.text).toContain('19:30');
    expect(page.text).toContain('/demo/confirm/' + token);
  });

  it('không mở phiếu chỉ bằng URL; thao tác xem phiếu mẫu mới đưa mẫu vào danh sách quản lý', async () => {
    const { app } = setup();
    const token = await checkout(app);
    expect((await request(app).get('/demo/receipt/' + token)).status).toBe(409);
    const before = await request(app).get('/demo/owner');
    expect(before.text).not.toContain('Khách thử');
    const confirmation = await request(app).post('/demo/confirm/' + token);
    expect(confirmation.status).toBe(303);
    expect(confirmation.headers.location).toBe('/demo/receipt/' + token);
    const receipt = await request(app).get(confirmation.headers.location);
    expect(receipt.status).toBe(200);
    expect(receipt.text).toContain('Khách thử');
    expect((await request(app).get('/demo/owner')).text).toContain('Khách thử');
  });

  it('hết 10 phút thì server từ chối mở phiếu dù khách bỏ qua đồng hồ trên trình duyệt', async () => {
    const { app, advance } = setup();
    const token = await checkout(app);
    advance(10);
    expect((await request(app).get('/demo/payment/' + token)).status).toBe(410);
    expect((await request(app).post('/demo/confirm/' + token)).status).toBe(410);
    expect((await request(app).get('/demo/receipt/' + token)).status).toBe(409);
  });

  it('mẫu đã mở không tạo thêm bản ghi khi gửi lại thao tác, không mất phiếu khi hết thời gian chờ', async () => {
    const { app, advance } = setup();
    const token = await checkout(app);
    await request(app).post('/demo/confirm/' + token);
    advance(11);
    expect((await request(app).post('/demo/confirm/' + token)).status).toBe(303);
    expect((await request(app).get('/demo/payment/' + token)).headers.location).toBe('/demo/receipt/' + token);
    const owner = await request(app).get('/demo/owner');
    expect(owner.text.split('href="/demo/receipt/' + token + '"').length - 1).toBe(1);
  });

  it('giới hạn danh sách mẫu theo cơ sở đang xem và hết hạn dữ liệu thử sau một giờ', async () => {
    const { app, advance } = setup();
    const token = await checkout(app);
    await request(app).post('/demo/confirm/' + token);
    expect((await request(app).get('/demo/owner?facilityId=co-so-mau-2')).text).not.toContain('Khách thử');
    advance(60);
    expect((await request(app).get('/demo/receipt/' + token)).status).toBe(404);
  });

  it('từ chối dữ liệu lỗi/ô đã đặt và token không tồn tại', async () => {
    const { app } = setup();
    expect((await request(app).post('/demo/checkout')).status).toBe(400);
    expect((await request(app).post('/demo/checkout').type('form').send({ ...form, times: '18:00' })).status).toBe(400);
    expect((await request(app).get('/demo/payment/khong-co')).status).toBe(404);
    expect((await request(app).post('/demo/confirm/khong-co')).status).toBe(404);
  });

  it('không có route mẫu ở chế độ MongoDB, không cần truy vấn database để chặn chúng', async () => {
    const app = createApp({ demo: false });
    for (const path of ['/demo/owner', '/demo/payment/test', '/demo/receipt/test']) {
      expect((await request(app).get(path)).status).toBe(404);
    }
    expect((await request(app).post('/demo/checkout').type('form').send(form)).status).toBe(404);
    expect((await request(app).post('/demo/confirm/test')).status).toBe(404);
  });
});
