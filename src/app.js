import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import { createCatalog } from './services/catalog.js';
import { createBookingService } from './services/booking.service.js';
import { createDemoPreviews } from './services/demo-previews.js';
import { createViewLocals } from './middleware/view-locals.js';
import { errorHandler, pageNotFound } from './middleware/error-handler.js';
import { createHealthRoutes } from './routes/health.routes.js';
import { createCatalogRoutes } from './routes/catalog.routes.js';
import { createQuoteRoutes } from './routes/quote.routes.js';
import { createOwnerRoutes } from './routes/owner.routes.js';
import { createDemoRoutes } from './routes/demo.routes.js';
import { createApiRoutes } from './routes/api.routes.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function createApp({ demo = true, clock = () => new Date(), databaseReady = () => false } = {}) {
  const app = express();
  const catalog = createCatalog(demo);
  const bookingService = createBookingService({ catalog, clock });
  const previews = demo ? createDemoPreviews(clock) : null;
  const services = { demo, clock, databaseReady, catalog, bookingService, previews };
  app.disable('x-powered-by');
  app.use(helmet());
  // Trang lỗi vẫn cần các biến này khi parser dừng request trước khi vào route.
  app.use(createViewLocals({ demo }));
  app.use(express.urlencoded({ extended: false, limit: '20kb' }));
  app.use(express.json({ limit: '20kb' }));
  app.set('view engine', 'ejs');
  app.set('views', path.join(root, 'views'));
  app.use('/assets', express.static(path.join(root, 'public')));
  app.use('/vendor/bootstrap', express.static(path.join(root, 'node_modules/bootstrap/dist/css')));

  app.use(createHealthRoutes(services));
  app.use(createCatalogRoutes(services));
  app.use(createQuoteRoutes(services));
  app.use(createOwnerRoutes());
  app.use('/demo', createDemoRoutes(services));
  app.use('/api', createApiRoutes(services));
  app.use(pageNotFound);
  app.use(errorHandler);
  return app;
}
