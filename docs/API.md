# API và đường dẫn hiện hành

Phân biệt API đọc/báo giá, các trang mẫu và API dự kiến. Trang có giao diện không có nghĩa nghiệp vụ đã được triển khai.

## API đã chạy

| Method | Đường dẫn | Nội dung |
|---|---|---|
| GET | `/health` | Trạng thái app, chế độ, kết nối DB |
| GET | `/api/facilities` | Danh sách cơ sở |
| GET | `/api/facilities/:id/courts` | Sân của cơ sở |
| GET | `/api/courts/:id/availability?date=YYYY-MM-DD` | Ô giờ và trạng thái |
| POST | `/api/quotes` | Kiểm tra khách, ô giờ, tính giá; không giữ chỗ |

Đầu vào báo giá:

```json
{
  "courtId": "san-mau-1",
  "date": "2026-11-10",
  "times": ["16:30", "19:30"],
  "guest": { "name": "Khách mẫu", "phone": "0912345678" }
}
```

Response có `demo`, `holdsSlots: false`, `guest`, `courtId`, `date`, `slots`, `totalMinutes`, `totalPriceVND`. Backend tính giá, không nhận giá client làm giá chính thức. ID mẫu chỉ dùng khi `DEMO_MODE=true`; chế độ MongoDB dùng ObjectId.

Ô có `time`, `endTime`, `priceVND`, `status`: AVAILABLE, BOOKED, LOCKED, UNAVAILABLE. LOCKED ở dữ liệu mẫu không phải đơn thật. POST form `/quotes` hiện báo giá cùng quy tắc, không tạo booking.

Lỗi API: `{ "error": { "code": "...", "message": "..." } }`, gồm `/api` hoặc `/api/...` không tồn tại.

| HTTP | Code | Ý nghĩa |
|---|---|---|
| 400 | VALIDATION_ERROR | Body thiếu/sai cấu trúc, JSON sai hoặc dữ liệu nghiệp vụ không hợp lệ |
| 404 | NOT_FOUND | Sân/cơ sở hoặc API không tồn tại |
| 413 | PAYLOAD_TOO_LARGE | Body vượt 20 KB |
| 500 | INTERNAL_ERROR | Lỗi ngoài dự kiến |

Báo giá kiểm tra cấu trúc trước khi tìm sân. `courtId`, `date` là chuỗi, `times` là mảng ô, `guest` có tên/SĐT hợp lệ. Request đúng cấu trúc nhưng sân không tồn tại trả 404; sai cấu trúc trả 400. Form chuẩn hóa trường hợp chọn một ô. Giá luôn được tính lại từ dữ liệu sân.

## Trang mẫu – chỉ trong DEMO_MODE=true

| Method | Đường dẫn | Nội dung |
|---|---|---|
| POST | `/demo/checkout` | Kiểm tra/tính lại giá, tạo phiên xem thử trong bộ nhớ |
| GET | `/demo/payment/:token` | Trang thanh toán mẫu, thông tin đơn và hạn 10 phút |
| POST | `/demo/confirm/:token` | Nút **Xem phiếu mẫu**, mô phỏng chuyển sang phiếu |
| GET | `/demo/receipt/:token` | Phiếu mẫu gồm mã, khách, sân/địa chỉ, ngày/ô và giá |
| GET | `/demo/owner` | Bố cục quản lý với dữ liệu mẫu; chưa có đăng nhập/thao tác thật |

Checkout nhận thông tin sân/ngày/ô và tên/SĐT như form báo giá; backend kiểm tra và tính lại giá. `:token` chỉ nhận diện phiên xem thử tạm thời, không phải token quản lý booking thật. Sau 10 phút chưa mở phiếu, trang thanh toán mẫu trả 410 và không mở phiếu được nữa. Phiếu đã mở có thể xem lại trong thời gian dữ liệu còn ở bộ nhớ: tối đa một giờ từ khi tạo phiên, hoặc đến lúc khởi động lại server. Đường dẫn phiên không còn dữ liệu trả 404; yêu cầu phiếu trước khi mở phiếu mẫu trả 409.

Các trang này **không tạo booking, không giữ ô, không ghi MongoDB, không nhận hoặc xác minh tiền**. Không dùng route `confirm` mẫu để xác nhận thanh toán thật. Khi `DEMO_MODE=false`, các route mẫu không được mở. Trang owner mẫu không thay thế xác thực/phân quyền/check-in.

## Dự kiến – chưa triển khai

| Method | Đường dẫn | Nghiệp vụ |
|---|---|---|
| POST | `/api/bookings` | Lưu khách, tạo WAITING_PAYMENT, giữ tất cả ô trong transaction 10 phút |
| GET | `/api/bookings/:id` | Xem/tra cứu đơn bằng token riêng hợp lệ |
| GET | `/api/bookings/:id/receipt` | Phiếu đơn đã được xác nhận, yêu cầu quyền xem đơn hợp lệ |
| POST | `/api/bookings/:id/cancel` | Hủy theo chính sách, tạo nghĩa vụ hoàn tiền |
| POST | `/api/bookings/:id/change` | Kiểm tra giờ mới/tính phí, giữ đơn cũ đến khi hoàn tất |
| POST | `/api/payments/webhook` | Xác thực thông báo giao dịch, đối chiếu và ghi nhận một lần |
| POST | `/owner/login` | Đăng nhập chủ sân, tạo session |
| POST | `/owner/logout` | Hủy session |
| GET | `/api/owner/bookings` | Đọc đơn của cơ sở trong session, hỗ trợ tra mã đơn |
| POST | `/api/owner/bookings/:id/check-in` | Kiểm tra đơn đúng cơ sở, đã trả tiền/chưa check-in rồi ghi nhận |
| POST | `/api/owner/bookings` | Nhập đơn ngoài web nếu vẫn nhận, tự ghi nhận tiền đã kiểm tra |
| PATCH | `/api/owner/courts/:id` | Sửa sân/giá thuộc cơ sở của chủ sân |

Backend xác nhận đủ tiền rồi website mới hiển thị phiếu thật. Mã đơn/ảnh chụp giúp chủ sân tra cứu, không tự xác nhận tiền hoặc cấp quyền khách hủy/đổi. Khách nhắn Zalo được ưu tiên gửi link đặt web, không có API đọc tin nhắn Zalo.

API quản lý thay đổi dữ liệu phải xác thực, lấy phạm vi cơ sở từ session, bảo vệ CSRF khi dùng cookie và kiểm tra quyền ở backend. Check-in cần chống thao tác lặp. Webhook cần xác thực theo nhà cung cấp; nhà cung cấp kết nối MB và hợp đồng payload chưa được chốt. Các route dự kiến có thể điều chỉnh khi triển khai nhưng phải cập nhật tài liệu.
