import { z } from 'zod';

// Form HTML gửi một ô thành chuỗi; API JSON gửi danh sách ô.
export function quoteFormInput(body = {}) {
  body = body ?? {};
  const times = body.times === undefined ? [] : Array.isArray(body.times) ? body.times : [body.times];
  return { courtId: body.courtId, date: body.date, times, guest: { name: body.name, phone: body.phone } };
}

export const guestSchema = z.object({
  name: z.string().trim().min(2, 'Tên cần ít nhất 2 ký tự.').max(100),
  phone: z.string().trim().transform(value => value.replace(/[\s.-]/g, '').replace(/^\+84/, '0'))
    .pipe(z.string().regex(/^0\d{9}$/, 'Nhập số điện thoại Việt Nam gồm 10 số.')),
});

export const quoteRequestSchema = z.object({
  courtId: z.string({ error: 'Mã sân phải là chuỗi.' }).trim().min(1, 'Hãy chọn sân.'),
  date: z.string({ error: 'Hãy chọn ngày chơi.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày phải có dạng YYYY-MM-DD.'),
  times: z.array(z.string().regex(/^(?:[01]\d|2[0-3]):[03]0$/, 'Ô giờ phải có dạng HH:00 hoặc HH:30.'))
    .min(1, 'Hãy chọn ít nhất một ô giờ.'),
  guest: guestSchema,
}, { error: 'Vui lòng gửi đầy đủ thông tin đặt sân.' });
