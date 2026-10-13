import mongoose from 'mongoose';

const { Schema } = mongoose;
const ref = model => ({ type: Schema.Types.ObjectId, ref: model, required: true });
const vnd = { type: Number, required: true, min: 0, validate: Number.isSafeInteger };
const time = { type: String, required: true, match: /^(?:[01]\d|2[0-3]):[03]0$/ };

const facilitySchema = new Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  phone: String,
}, { timestamps: true });

const userSchema = new Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  facilityId: ref('Facility'),
  role: { type: String, enum: ['OWNER'], default: 'OWNER' },
}, { timestamps: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ facilityId: 1 }, { unique: true });

const courtSchema = new Schema({
  facilityId: ref('Facility'), name: { type: String, required: true },
  sportType: { type: String, enum: ['BADMINTON', 'PICKLEBALL'], default: 'BADMINTON' },
  openTime: time, closeTime: time, peakStartTime: time,
  basePriceVND: vnd, peakPriceVND: vnd,
  active: { type: Boolean, default: true },
}, { timestamps: true });
courtSchema.index({ facilityId: 1, name: 1 }, { unique: true });
courtSchema.pre('validate', function () {
  if (this.openTime && this.closeTime && this.openTime >= this.closeTime) {
    this.invalidate('closeTime', 'Giờ đóng cửa phải sau giờ mở cửa; prototype chưa hỗ trợ qua đêm.');
  }
});

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

const slotLockSchema = new Schema({
  courtId: ref('Court'), bookingId: ref('Booking'), slotStart: { type: Date, required: true },
  // null = đã booked; Date = giữ chỗ chờ thanh toán. Không dùng TTL để xóa booking.
  expiresAt: { type: Date, default: null },
}, { timestamps: true });
slotLockSchema.index({ courtId: 1, slotStart: 1 }, { unique: true });

const paymentSchema = new Schema({
  bookingId: ref('Booking'), amountVND: vnd,
  type: { type: String, enum: ['RECEIPT', 'REFUND', 'CHANGE_FEE'], required: true },
  method: { type: String, enum: ['BANK', 'CASH'], required: true },
  externalTransactionId: String,
  recordedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  occurredAt: { type: Date, required: true },
}, { timestamps: true });
paymentSchema.index({ externalTransactionId: 1 }, { unique: true, partialFilterExpression: { externalTransactionId: { $type: 'string' } } });

const refundSchema = new Schema({
  bookingId: ref('Booking'), amountVND: vnd, requestedAt: { type: Date, required: true },
  dueAt: Date,
  status: { type: String, enum: ['PENDING', 'TRANSFERRED'], default: 'PENDING' },
  transferredAt: Date,
}, { timestamps: true });

export const Facility = mongoose.model('Facility', facilitySchema);
export const User = mongoose.model('User', userSchema);
export const Court = mongoose.model('Court', courtSchema);
export const Booking = mongoose.model('Booking', bookingSchema);
export const SlotLock = mongoose.model('SlotLock', slotLockSchema);
export const Payment = mongoose.model('Payment', paymentSchema);
export const Refund = mongoose.model('Refund', refundSchema);
