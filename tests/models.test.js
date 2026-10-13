import { it, expect } from 'vitest';
import mongoose from 'mongoose';
import { Booking, Court } from '../src/models/index.js';

it('schema lưu ô rời nhau và thiếu thông tin khách thì không hợp lệ', async () => {
  const booking = new Booking({ facilityId: new mongoose.Types.ObjectId(), courtId: new mongoose.Types.ObjectId(),
    guestName: 'Khách mẫu', guestPhone: '0912345678', guestTokenHash: 'test-only-hash', totalPriceVND: 80000,
    slots: [{ startAt: new Date('2026-11-10T10:00Z'), endAt: new Date('2026-11-10T10:30Z'), priceVND: 40000 },
      { startAt: new Date('2026-11-10T12:00Z'), endAt: new Date('2026-11-10T12:30Z'), priceVND: 40000 }],
    policySnapshot: { holdMinutes: 10, changeFeeVND: 30000 } });
  await expect(booking.validate()).resolves.toBeUndefined();
  booking.guestName = '';
  await expect(booking.validate()).rejects.toThrow();
});

it('không nhận giá âm hoặc giờ đóng trước giờ mở', async () => {
  const court = new Court({ facilityId: new mongoose.Types.ObjectId(), name: 'Sân mẫu', openTime: '22:00', closeTime: '06:00', peakStartTime: '17:00', basePriceVND: -1, peakPriceVND: 60000 });
  await expect(court.validate()).rejects.toThrow();
});
