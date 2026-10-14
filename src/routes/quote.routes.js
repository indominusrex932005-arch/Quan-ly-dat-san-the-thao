import { Router } from 'express';
import { createQuoteController } from '../controllers/quote.controller.js';

export function createQuoteRoutes(services) {
  const router = Router();
  const controller = createQuoteController(services);
  router.post('/quotes', controller.page);
  return router;
}
