import { mongoose, Schema, ref, vnd } from './schema-types.js';

const paymentSchema = new Schema({
  bookingId: ref('Booking'), amountVND: vnd,
  type: { type: String, enum: ['RECEIPT', 'REFUND', 'CHANGE_FEE'], required: true },
  method: { type: String, enum: ['BANK', 'CASH'], required: true },
  externalTransactionId: String,
  recordedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  occurredAt: { type: Date, required: true },
}, { timestamps: true });
paymentSchema.index({ externalTransactionId: 1 }, { unique: true, partialFilterExpression: { externalTransactionId: { $type: 'string' } } });

export const Payment = mongoose.model('Payment', paymentSchema);
