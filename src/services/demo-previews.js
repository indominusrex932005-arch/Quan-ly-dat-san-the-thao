import { randomBytes } from 'node:crypto';
import { holdExpiresAt } from '../domain/booking-rules.js';

const PREVIEW_LIFETIME_MS = 60 * 60 * 1000;
const MAX_PREVIEWS = 100;

function fail(status, message) {
  throw Object.assign(new Error(message), { status });
}

// Chỉ dùng để thử các màn hình. Không ghi Booking, SlotLock hoặc Payment.
export function createDemoPreviews(clock) {
  const entries = new Map();
  function clean() {
    const now = Number(clock());
    for (const [token, preview] of entries) {
      if (now - Number(preview.createdAt) >= PREVIEW_LIFETIME_MS) entries.delete(token);
    }
  }
  function get(token) {
    clean();
    const preview = entries.get(token);
    if (!preview) fail(404, 'Không tìm thấy phiên thử giao diện. Hãy chọn sân để thử lại.');
    return { ...preview, expired: !preview.confirmedAt && Number(clock()) >= Number(preview.expiresAt) };
  }
  return {
    create(details) {
      clean();
      if (entries.size >= MAX_PREVIEWS) entries.delete(entries.keys().next().value);
      const createdAt = new Date(clock());
      const preview = { ...details, token: randomBytes(24).toString('hex'),
        code: 'MAU-' + randomBytes(4).toString('hex').toUpperCase(),
        createdAt, expiresAt: holdExpiresAt(createdAt), confirmedAt: null };
      entries.set(preview.token, preview);
      return preview;
    },
    get,
    confirm(token) {
      const preview = get(token);
      if (preview.expired) fail(410, 'Phiên thử đã hết 10 phút. Hãy chọn sân để thử lại.');
      if (!preview.confirmedAt) entries.get(token).confirmedAt = new Date(clock());
      return get(token);
    },
    receipt(token) {
      const preview = get(token);
      if (!preview.confirmedAt) fail(409, 'Phiếu mẫu chưa được mở. Hãy tiếp tục từ trang thanh toán mẫu.');
      return preview;
    },
    list(facilityId) {
      clean();
      return [...entries.values()].filter(item => item.confirmedAt && String(item.facility._id) === facilityId).reverse();
    },
  };
}
