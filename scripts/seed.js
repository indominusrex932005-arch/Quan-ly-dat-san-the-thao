import mongoose from 'mongoose';
import 'dotenv/config';
import { Facility, Court } from '../src/models/index.js';
import { demoFacilities, demoCourts } from '../src/data/demo-catalog.js';

if (!process.env.MONGODB_URI) throw new Error('Cần MONGODB_URI riêng để nhập dữ liệu mẫu.');
if (process.env.NODE_ENV === 'production') throw new Error('Không nhập dữ liệu mẫu ở production.');
try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  const mapping = new Map();
  for (const sample of demoFacilities) {
    const facility = await Facility.findOneAndUpdate({ name: sample.name }, { name: sample.name, address: sample.address }, { upsert: true, new: true, runValidators: true });
    mapping.set(sample._id, facility._id);
  }
  for (const { _id, facilityId, ...sample } of demoCourts) {
    void _id;
    const actualId = mapping.get(facilityId);
    await Court.findOneAndUpdate({ facilityId: actualId, name: sample.name }, { ...sample, facilityId: actualId }, { upsert: true, runValidators: true });
  }
  console.log('Đã nhập 2 cơ sở và 3 sân mẫu. Chưa tạo tài khoản hoặc đơn.');
} catch (error) {
  console.error('Không nhập được dữ liệu mẫu. Kiểm tra cấu hình và quyền database. Loại lỗi:', error.name);
  process.exitCode = 1;
} finally { await mongoose.disconnect(); }
