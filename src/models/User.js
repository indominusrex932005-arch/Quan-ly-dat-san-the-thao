import { mongoose, Schema, ref } from './schema-types.js';

const userSchema = new Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  facilityId: ref('Facility'),
  role: { type: String, enum: ['OWNER'], default: 'OWNER' },
}, { timestamps: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ facilityId: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
