import mongoose from 'mongoose';
import { createApp } from './app.js';
import { loadConfig } from './config.js';

try {
  const config = loadConfig();
  if (!config.demo) await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10000 });
  const app = createApp({ demo: config.demo, databaseReady: () => mongoose.connection.readyState === 1 });
  const server = app.listen(config.port, '0.0.0.0', () => {
    console.log('Ứng dụng chạy ở cổng ' + config.port + '; chế độ ' + (config.demo ? 'dữ liệu mẫu' : 'MongoDB') + '.');
  });
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => server.close(async () => { await mongoose.disconnect(); process.exit(0); }));
  }
} catch (error) {
  // Không in connection string hoặc thông tin đăng nhập database.
  console.error('Không thể khởi động. Kiểm tra cấu hình và kết nối MongoDB. Loại lỗi:', error.name);
  process.exitCode = 1;
}
