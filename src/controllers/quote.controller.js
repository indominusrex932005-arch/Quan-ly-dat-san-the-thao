import { quoteFormInput } from '../domain/validation.js';

export function createQuoteController({ catalog, bookingService, demo }) {
  return {
    async page(req, res) {
      const result = await bookingService.quote(quoteFormInput(req.body));
      res.render('quote', { ...result, facility: await catalog.facility(String(result.court.facilityId)) });
    },
    async api(req, res) {
      const result = await bookingService.quote(req.body);
      res.json({ demo, holdsSlots: false, guest: result.guest, courtId: String(result.court._id),
        date: result.date, ...result.quote });
    },
  };
}
