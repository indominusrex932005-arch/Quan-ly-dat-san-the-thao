import { mongoose, Schema, ref } from './schema-types.js';

const slotLockSchema = new Schema({
  courtId: ref('Court'), bookingId: ref('Booking'), slotStart: { type: Date, required: true },
  // null = đã booked; Date = giữ chỗ chờ thanh toán. Không dùng TTL để xóa booking.
  expiresAt: { type: Date, default: null },
}, { timestamps: true });
slotLockSchema.index({ courtId: 1, slotStart: 1 }, { unique: true });

export const SlotLock = mongoose.model('SlotLock', slotLockSchema);
