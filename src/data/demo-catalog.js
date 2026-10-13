import { slotInstant } from '../domain/booking-rules.js';

// Dữ liệu giả để xây UI. Không phải dữ liệu khảo sát hoặc sân có thật.
export const demoFacilities = [
  { _id: 'co-so-mau-1', name: 'Cơ sở cầu lông mẫu 1', address: 'Địa chỉ mẫu – cần chủ sân cập nhật' },
  { _id: 'co-so-mau-2', name: 'Cơ sở cầu lông mẫu 2', address: 'Địa chỉ mẫu – cần chủ sân cập nhật' },
];
export const demoCourts = [
  { _id: 'san-mau-1', facilityId: 'co-so-mau-1', name: 'Sân số 1', sportType: 'BADMINTON', openTime: '06:00', closeTime: '22:00', peakStartTime: '17:00', basePriceVND: 40000, peakPriceVND: 60000, active: true },
  { _id: 'san-mau-2', facilityId: 'co-so-mau-1', name: 'Sân số 2', sportType: 'BADMINTON', openTime: '06:00', closeTime: '22:00', peakStartTime: '17:00', basePriceVND: 40000, peakPriceVND: 60000, active: true },
  { _id: 'san-mau-3', facilityId: 'co-so-mau-2', name: 'Sân số 1', sportType: 'BADMINTON', openTime: '07:00', closeTime: '21:00', peakStartTime: '17:00', basePriceVND: 50000, peakPriceVND: 70000, active: true },
];

export function demoLocks(date, now) {
  return [{ slotStart: slotInstant(date, '18:00'), expiresAt: null },
    { slotStart: slotInstant(date, '19:00'), expiresAt: new Date(now.getTime() + 10 * 60000) }];
}
