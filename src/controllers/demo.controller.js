import { quoteFormInput } from '../domain/validation.js';
import { vietnamDate } from '../domain/booking-rules.js';

export function createDemoController({ catalog, bookingService, previews, clock }) {
  return {
    async checkout(req, res) {
      const result = await bookingService.quote(quoteFormInput(req.body));
      const preview = previews.create({ ...result, facility: await catalog.facility(String(result.court.facilityId)) });
      res.redirect(303, '/demo/payment/' + preview.token);
    },
    payment(req, res) {
      const preview = previews.get(req.params.token);
      if (preview.confirmedAt) return res.redirect(303, '/demo/receipt/' + preview.token);
      res.status(preview.expired ? 410 : 200).render('demo-payment', { preview });
    },
    confirm(req, res) {
      const preview = previews.confirm(req.params.token);
      res.redirect(303, '/demo/receipt/' + preview.token);
    },
    receipt(req, res) {
      res.render('demo-receipt', { preview: previews.receipt(req.params.token) });
    },
    async owner(req, res) {
      const facilities = await catalog.facilities();
      const facility = facilities.find(item => item._id === req.query.facilityId) || facilities[0];
      res.render('demo-owner', { facility, facilities, previews: previews.list(String(facility._id)), date: vietnamDate(clock()) });
    },
  };
}
