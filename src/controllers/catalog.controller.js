export function createCatalogController({ catalog, bookingService, demo }) {
  return {
    async home(_req, res) {
      res.render('home', { facilities: await catalog.facilities() });
    },
    async facilityPage(req, res) {
      const facility = await catalog.facility(req.params.id);
      if (!facility) return res.status(404).render('error', { message: 'Không tìm thấy cơ sở.' });
      res.render('facility', { facility, courts: await catalog.courts(req.params.id) });
    },
    async courtPage(req, res) {
      const calendar = await bookingService.availability(req.params.id, req.query.date);
      res.render('court', { ...calendar, facility: await catalog.facility(String(calendar.court.facilityId)) });
    },
    async listFacilities(_req, res) {
      res.json({ demo, data: await catalog.facilities() });
    },
    async listCourts(req, res) {
      if (!await catalog.facility(req.params.id)) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Không tìm thấy cơ sở.' } });
      }
      res.json({ demo, data: await catalog.courts(req.params.id) });
    },
    async availability(req, res) {
      const calendar = await bookingService.availability(req.params.id, req.query.date);
      res.json({ demo, date: calendar.date, data: calendar.slots });
    },
  };
}
