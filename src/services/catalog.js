import mongoose from 'mongoose';
import { Facility, Court, SlotLock } from '../models/index.js';
import { demoFacilities, demoCourts, demoLocks } from '../data/demo-catalog.js';
import { slotInstant } from '../domain/booking-rules.js';

export function createCatalog(demo) {
  return {
    async facilities() { return demo ? demoFacilities : Facility.find().sort({ name: 1 }).lean(); },
    async facility(id) { return demo ? demoFacilities.find(item => item._id === id) : mongoose.isValidObjectId(id) ? Facility.findById(id).lean() : null; },
    async courts(facilityId) {
      return demo ? demoCourts.filter(item => item.facilityId === facilityId)
        : mongoose.isValidObjectId(facilityId) ? Court.find({ facilityId, active: true }).lean() : [];
    },
    async court(id) { return demo ? demoCourts.find(item => item._id === id) : mongoose.isValidObjectId(id) ? Court.findOne({ _id: id, active: true }).lean() : null; },
    async locks(courtId, date, now) {
      if (demo) return demoLocks(date, now);
      const start = slotInstant(date, '00:00');
      return SlotLock.find({ courtId, slotStart: { $gte: start, $lt: new Date(start.getTime() + 86400000) } }).lean();
    },
  };
}
