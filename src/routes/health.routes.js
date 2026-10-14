import { Router } from 'express';
import { createHealthController } from '../controllers/health.controller.js';

export function createHealthRoutes(services) {
  const router = Router();
  const controller = createHealthController(services);
  router.get('/health', controller.status);
  return router;
}
