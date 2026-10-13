# API của bộ khởi đầu

## Đã chạy được

| Method | Đường dẫn | Nội dung |
|---|---|---|
| GET | `/health` | Trạng thái app, chế độ, tình trạng kết nối DB |
| GET | `/api/facilities` | Danh sách cơ sở |
| GET | `/api/facilities/:id/courts` | Sân của cơ sở |
| GET | `/api/courts/:id/availability?date=YYYY-MM-DD` | Ô giờ và trạng thái |
| POST | `/api/quotes` | Kiểm tra khách, ô giờ và tính giá; không giữ chỗ |

Đầu vào báo giá:

```json
{
  "courtId": "san-mau-1",
  "date": "2026-11-10",
  "times": ["16:30", "19:30"],
  "guest": { "name": "Khách mẫu", "phone": "0912345678" }
}
```

Response có `demo`, `holdsSlots: false`, `guest`, `courtId`, `date`, `slots`, `totalMinutes`, `totalPriceVND`. Giá do backend tính; không nhận giá frontend làm giá chính thức. ID mẫu chỉ dùng khi DEMO_MODE=true; kết nối MongoDB dùng ObjectId.

Ô giờ có `time`, `endTime`, `priceVND`, `status`: AVAILABLE, BOOKED, LOCKED, UNAVAILABLE. LOCKED ở dữ liệu mẫu dùng để thiết kế UI, không phải đơn thật.

Lỗi API dùng `{ "error": { "code": "...", "message": "..." } }`, gồm cả đường dẫn `/api` hoặc `/api/...` không tồn tại.

| HTTP | Code | Ý nghĩa |
|---|---|---|
| 400 | VALIDATION_ERROR | Body thiếu/sai cấu trúc, JSON sai cú pháp hoặc dữ liệu nghiệp vụ không hợp lệ |
| 404 | NOT_FOUND | Sân/cơ sở hoặc API không tồn tại |
| 413 | PAYLOAD_TOO_LARGE | Body vượt giới hạn 20 KB |
| 500 | INTERNAL_ERROR | Lỗi xử lý ngoài dự kiến |

Request báo giá được kiểm tra cấu trúc trước khi tìm sân. `courtId` và `date` là chuỗi, `times` là mảng ô giờ, `guest` có tên/SĐT hợp lệ. Request hợp lệ có sân không tồn tại trả 404; request sai cấu trúc trả 400. Form HTML được chuẩn hóa để chọn một ô vẫn hợp lệ. Backend tiếp tục bỏ qua giá khách gửi và tính giá từ dữ liệu sân.

## Dự kiến – chưa triển khai

| Method | Đường dẫn | Nghiệp vụ |
|---|---|---|
| POST | `/api/bookings` | Tạo đơn, lưu khách, giữ tất cả ô trong transaction |
| GET | `/api/bookings/:id` | Xem đơn bằng token quản lý đơn riêng |
| POST | `/api/bookings/:id/cancel` | Hủy và tạo nghĩa vụ hoàn tiền |
| POST | `/api/bookings/:id/change` | Kiểm tra lịch mới, tính phí; giữ đơn cũ đến khi hoàn tất |
| POST | `/api/payments/webhook` | Xác minh thông báo giao dịch và ghi nhận một lần |
| POST | `/owner/login` | Đăng nhập chủ sân và tạo session |
| POST | `/owner/logout` | Hủy session |
| GET | `/api/owner/bookings` | Chỉ đọc đơn thuộc cơ sở trong session |
| POST | `/api/owner/bookings` | Nhập đơn ngoài web, ghi nhận tình trạng tiền |
| PATCH | `/api/owner/courts/:id` | Sửa sân/giá thuộc cơ sở của chủ sân |

API thay đổi dữ liệu quản lý cần xác thực, giới hạn cơ sở theo session, bảo vệ CSRF khi dùng cookie và kiểm tra quyền ở backend. Xây những phần này trước khi mở cho sử dụng thật.
