import { mongoose, Schema, ref, vnd, time } from './schema-types.js';

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

export const Court = mongoose.model('Court', courtSchema);
