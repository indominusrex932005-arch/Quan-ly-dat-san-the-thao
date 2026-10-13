import 'dotenv/config';

export function loadConfig(env = process.env) {
  const production = env.NODE_ENV === 'production';
  const demo = env.DEMO_MODE === 'true' || (!production && env.DEMO_MODE === undefined);
  const port = Number(env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT không hợp lệ.');
  if (production && demo) throw new Error('Không chạy dữ liệu mẫu ở production.');
  if (!demo && !env.MONGODB_URI) throw new Error('Cần cấu hình MONGODB_URI.');
  if (!demo && (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32)) {
    throw new Error('SESSION_SECRET cần ít nhất 32 ký tự.');
  }
  return { port, demo, production, mongoUri: env.MONGODB_URI, sessionSecret: env.SESSION_SECRET };
}
