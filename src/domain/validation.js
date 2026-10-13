import { z } from 'zod';

export const guestSchema = z.object({
  name: z.string().trim().min(2, 'Tên cần ít nhất 2 ký tự.').max(100),
  phone: z.string().trim().transform(value => value.replace(/[\s.-]/g, '').replace(/^\+84/, '0'))
    .pipe(z.string().regex(/^0\d{9}$/, 'Nhập số điện thoại Việt Nam gồm 10 số.')),
});
