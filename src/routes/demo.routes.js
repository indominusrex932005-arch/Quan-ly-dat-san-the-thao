import { Router } from 'express';
import { createDemoController } from '../controllers/demo.controller.js';
import { createDemoOnly } from '../middleware/demo-only.js';

export function createDemoRoutes(services) {
  const router = Router();
  const controller = createDemoController(services);
  router.use(createDemoOnly(services));
  router.post('/checkout', controller.checkout);
  router.get('/payment/:token', controller.payment);
  router.post('/confirm/:token', controller.confirm);
  router.get('/receipt/:token', controller.receipt);
  router.get('/owner', controller.owner);
  return router;
}
