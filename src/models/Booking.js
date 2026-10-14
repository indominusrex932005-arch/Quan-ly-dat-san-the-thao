import { mongoose, Schema, ref, vnd } from './schema-types.js';

const bookedSlotSchema = new Schema({
  startAt: { type: Date, required: true }, endAt: { type: Date, required: true }, priceVND: vnd,
}, { _id: false });
const bookingSchema = new Schema({
  facilityId: ref('Facility'), courtId: ref('Court'),
  guestName: { type: String, required: true }, guestPhone: { type: String, required: true },
  guestTokenHash: { type: String, required: true, select: false },
  slots: { type: [bookedSlotSchema], validate: value => value.length > 0 },
  totalPriceVND: vnd,
  status: { type: String, enum: ['WAITING_PAYMENT', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'EXPIRED', 'CANCELLED', 'NO_SHOW'], default: 'WAITING_PAYMENT' },
  source: { type: String, enum: ['WEB', 'ZALO', 'COUNTER'], default: 'WEB' },
  paymentStatus: { type: String, enum: ['UNPAID', 'PAID'], default: 'UNPAID' },
  holdExpiresAt: Date,
  policySnapshot: { type: Schema.Types.Mixed, required: true },
  changeHistory: [{ fromSlots: [bookedSlotSchema], toSlots: [bookedSlotSchema], extraAmountVND: Number, changedAt: Date }],
}, { timestamps: true });
bookingSchema.index({ facilityId: 1, createdAt: -1 });

export const Booking = mongoose.model('Booking', bookingSchema);
