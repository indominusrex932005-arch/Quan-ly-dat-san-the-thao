import { makeSlots, quoteSelection, vietnamDate } from '../domain/booking-rules.js';
import { quoteRequestSchema } from '../domain/validation.js';

// Hiện xử lý lịch/báo giá. Ghi booking và transaction giữ chỗ sẽ được làm tiếp.
export function createBookingService({ catalog, clock }) {
  async function findCourt(id) {
    const court = await catalog.court(id);
    if (!court) throw Object.assign(new Error('Không tìm thấy sân.'), { status: 404 });
    return court;
  }
  return {
    async availability(courtId, selectedDate) {
      const court = await findCourt(courtId);
      const date = selectedDate || vietnamDate(clock());
      const locks = await catalog.locks(court._id, date, clock());
      return { court, date, slots: makeSlots(court, date, locks, clock()) };
    },
    async quote(input) {
      const selection = quoteRequestSchema.parse(input);
      const court = await findCourt(selection.courtId);
      const locks = await catalog.locks(court._id, selection.date, clock());
      return { guest: selection.guest, court, date: selection.date,
        quote: quoteSelection(court, selection.date, selection.times, locks, clock()) };
    },
  };
}
