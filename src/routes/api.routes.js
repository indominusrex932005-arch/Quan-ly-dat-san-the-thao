import { Router } from 'express';
import { createCatalogController } from '../controllers/catalog.controller.js';
import { createQuoteController } from '../controllers/quote.controller.js';
import { apiNotFound } from '../middleware/error-handler.js';

export function createApiRoutes(services) {
  const router = Router();
  const catalog = createCatalogController(services);
  const quotes = createQuoteController(services);
  router.get('/facilities', catalog.listFacilities);
  router.get('/facilities/:id/courts', catalog.listCourts);
  router.get('/courts/:id/availability', catalog.availability);
  router.post('/quotes', quotes.api);
  router.use(apiNotFound);
  return router;
}
