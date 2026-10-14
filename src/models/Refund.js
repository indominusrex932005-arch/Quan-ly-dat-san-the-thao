import { mongoose, Schema, ref, vnd } from './schema-types.js';

const refundSchema = new Schema({
  bookingId: ref('Booking'), amountVND: vnd, requestedAt: { type: Date, required: true },
  dueAt: Date,
  status: { type: String, enum: ['PENDING', 'TRANSFERRED'], default: 'PENDING' },
  transferredAt: Date,
}, { timestamps: true });

export const Refund = mongoose.model('Refund', refundSchema);
