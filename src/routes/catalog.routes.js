import { Router } from 'express';
import { createCatalogController } from '../controllers/catalog.controller.js';

export function createCatalogRoutes(services) {
  const router = Router();
  const controller = createCatalogController(services);
  router.get('/', controller.home);
  router.get('/facilities/:id', controller.facilityPage);
  router.get('/courts/:id', controller.courtPage);
  return router;
}
