import { Router } from 'express';
import { createOwnerController } from '../controllers/owner.controller.js';

export function createOwnerRoutes() {
  const router = Router();
  const controller = createOwnerController();
  router.get('/owner/login', controller.loginPage);
  return router;
}
