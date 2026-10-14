import { mongoose, Schema } from './schema-types.js';

const facilitySchema = new Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  phone: String,
}, { timestamps: true });

export const Facility = mongoose.model('Facility', facilitySchema);
