export const SLOT_MINUTES = 30;
export const HOLD_MINUTES = 10;
export const CHANGE_FEE_VND = 30000;

export class RuleError extends Error {
  constructor(message) { super(message); this.name = 'RuleError'; }
}

export function timeToMinutes(time) {
  if (!/^\d{2}:\d{2}$/.test(time)) throw new RuleError('Giờ phải có dạng HH:mm.');
  const [hour, minute] = time.split(':').map(Number);
  if (hour > 23 || minute > 59) throw new RuleError('Giờ không hợp lệ.');
  return hour * 60 + minute;
}

export function minutesToTime(minutes) {
  return String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0');
}

export function validateDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new RuleError('Ngày không hợp lệ.');
  const parsed = new Date(date + 'T00:00:00Z');
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new RuleError('Ngày không tồn tại.');
  }
  return date;
}

export function vietnamDate(now = new Date()) {
  return new Date(now.getTime() + 7 * 3600000).toISOString().slice(0, 10);
}

export function slotInstant(date, time) {
  validateDate(date);
  timeToMinutes(time);
  return new Date(date + 'T' + time + ':00+07:00');
}

export function makeSlots(court, date, locks = [], now = new Date()) {
  validateDate(date);
  const open = timeToMinutes(court.openTime);
  const close = timeToMinutes(court.closeTime);
  const slots = [];
  for (let start = open; start + SLOT_MINUTES <= close; start += SLOT_MINUTES) {
    const time = minutesToTime(start);
    const instant = slotInstant(date, time);
    const lock = locks.find(item => Number(new Date(item.slotStart)) === Number(instant));
    // Lock hết hạn phải bị bỏ qua ngay khi đọc lịch; không chờ bộ dọn dẹp.
    const activeLock = lock && (!lock.expiresAt || Number(new Date(lock.expiresAt)) > Number(now));
    const status = instant <= now ? 'UNAVAILABLE' : activeLock ? (lock.expiresAt ? 'LOCKED' : 'BOOKED') : 'AVAILABLE';
    slots.push({ time, endTime: minutesToTime(start + SLOT_MINUTES), status,
      priceVND: start >= timeToMinutes(court.peakStartTime) ? court.peakPriceVND : court.basePriceVND });
  }
  return slots;
}

export function quoteSelection(court, date, times, locks = [], now = new Date()) {
  if (!Array.isArray(times) || times.length === 0) throw new RuleError('Hãy chọn ít nhất một ô giờ.');
  if (new Set(times).size !== times.length) throw new RuleError('Không chọn một ô hai lần.');
  const available = makeSlots(court, date, locks, now);
  const selected = times.map(time => {
    const slot = available.find(item => item.time === time);
    if (!slot || slot.status !== 'AVAILABLE') throw new RuleError('Ô ' + time + ' không còn trống hoặc không hợp lệ.');
    return slot;
  }).sort((a, b) => a.time.localeCompare(b.time));
  return { slots: selected, totalMinutes: selected.length * SLOT_MINUTES,
    totalPriceVND: selected.reduce((total, slot) => total + slot.priceVND, 0) };
}

function money(value) {
  if (!Number.isSafeInteger(value) || value < 0) throw new RuleError('Số tiền không hợp lệ.');
}

export function changeAmount(oldPriceVND, newPriceVND) {
  money(oldPriceVND); money(newPriceVND);
  return CHANGE_FEE_VND + Math.max(0, newPriceVND - oldPriceVND);
}

export function refundAmount(paidVND, firstSlotStart, requestedAt) {
  money(paidVND);
  const remaining = new Date(firstSlotStart) - new Date(requestedAt);
  if (!Number.isFinite(remaining)) throw new RuleError('Thời điểm hủy không hợp lệ.');
  if (remaining <= 0) return 0;
  return remaining >= 24 * 3600000 ? paidVND : Math.floor(paidVND / 2);
}

export function holdExpiresAt(createdAt) {
  return new Date(new Date(createdAt).getTime() + HOLD_MINUTES * 60000);
}
