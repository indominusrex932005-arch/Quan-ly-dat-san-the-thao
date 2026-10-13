import { describe, it, expect } from 'vitest';
import { demoCourts } from '../src/data/demo-catalog.js';
import { makeSlots, quoteSelection, slotInstant, changeAmount, refundAmount, holdExpiresAt, validateDate } from '../src/domain/booking-rules.js';

const court = demoCourts[0];
const date = '2026-11-10';
const now = new Date('2026-11-10T05:00:00+07:00');

describe('Các ô 30 phút', () => {
  it('tạo 32 ô từ 06:00 đến 22:00', () => {
    const slots = makeSlots(court, date, [], now);
    expect(slots).toHaveLength(32);
    expect(slots[31].endTime).toBe('22:00');
  });
  it('cho đặt một ô', () => expect(quoteSelection(court, date, ['06:00'], [], now).totalMinutes).toBe(30));
  it('ô rời nhau không giữ hoặc tính tiền ô ở giữa', () => {
    const quote = quoteSelection(court, date, ['19:00', '16:30'], [], now);
    expect(quote.slots.map(slot => slot.time)).toEqual(['16:30', '19:00']);
    expect(quote.totalMinutes).toBe(60);
    expect(quote.totalPriceVND).toBe(100000);
  });
  it('không nhận ô trùng hoặc không có ô', () => {
    expect(() => quoteSelection(court, date, ['06:00', '06:00'], [], now)).toThrow();
    expect(() => quoteSelection(court, date, [], [], now)).toThrow();
  });
  it('không nhận ô lệch 30 phút hoặc ngoài giờ', () => {
    for (const time of ['06:15', '05:30', '22:00']) expect(() => quoteSelection(court, date, [time], [], now)).toThrow();
  });
  it('không đặt ô quá khứ', () => expect(() => quoteSelection(court, date, ['06:00'], [], slotInstant(date, '06:00'))).toThrow());
  it('không chọn ô booked hoặc lock còn hạn', () => {
    const lock = { slotStart: slotInstant(date, '06:00'), expiresAt: null };
    expect(() => quoteSelection(court, date, ['06:00'], [lock], now)).toThrow();
    lock.expiresAt = new Date(now.getTime() + 1000);
    expect(makeSlots(court, date, [lock], now)[0].status).toBe('LOCKED');
  });
  it('mở lại ô khi lock vừa hết hạn dù bản ghi chưa dọn', () => {
    const lock = { slotStart: slotInstant(date, '06:00'), expiresAt: now };
    expect(makeSlots(court, date, [lock], now)[0].status).toBe('AVAILABLE');
  });
  it('từ chối ngày không tồn tại', () => expect(() => validateDate('2026-02-30')).toThrow());
});

describe('Phí và chính sách', () => {
  it('giữ chỗ đúng 10 phút', () => expect(holdExpiresAt(now).getTime() - now.getTime()).toBe(600000));
  it('đổi lịch thu phí và chỉ cộng chênh lệch dương', () => {
    expect(changeAmount(200000, 250000)).toBe(80000);
    expect(changeAmount(200000, 200000)).toBe(30000);
    expect(changeAmount(200000, 180000)).toBe(30000);
  });
  it('hoàn toàn bộ ở đúng mốc 24 giờ, nửa tiền khi dưới 24 giờ', () => {
    const start = slotInstant(date, '18:00');
    expect(refundAmount(200000, start, new Date(start.getTime() - 86400000))).toBe(200000);
    expect(refundAmount(200000, start, new Date(start.getTime() - 86400000 + 1))).toBe(100000);
  });
  it('không hoàn từ giờ bắt đầu trở đi', () => {
    const start = slotInstant(date, '18:00');
    expect(refundAmount(200000, start, start)).toBe(0);
  });
});
