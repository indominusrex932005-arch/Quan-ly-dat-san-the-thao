# Cách tổ chức code theo MVC

Dự án dùng JavaScript, Express, EJS và Mongoose. MVC giúp chia file rõ để dễ sửa, giải thích và làm chung; không đổi công nghệ hay luồng đặt sân đã thống nhất.

## Mỗi phần làm gì?

| Phần | Vai trò | Thư mục |
|---|---|---|
| Model | Cấu trúc và truy cập dữ liệu MongoDB | `src/models/` |
| View | Hiển thị giao diện EJS | `views/` |
| Controller | Nhận request, gọi phần xử lý, trả EJS hoặc JSON | `src/controllers/` |
| Routes | Gắn URL và HTTP method với controller | `src/routes/` |
| Services | Đọc dữ liệu, tính lịch/giá, xử lý nghiệp vụ | `src/services/` |
| Domain | Các quy tắc thời gian, phí và kiểm tra đầu vào dùng chung | `src/domain/` |
| Middleware | Biến dùng chung cho View và xử lý lỗi request | `src/middleware/` |

`src/server.js` khởi động server. `src/app.js` cấu hình Express, tạo các services và gắn routes. CSS/JavaScript phía trình duyệt nằm trong `public/`.

## Một request đi qua những đâu?

Ví dụ khách yêu cầu báo giá bằng `POST /api/quotes`:

1. API router nhận đúng URL và chuyển sang quote controller.
2. Controller đưa dữ liệu khách, sân, ngày và các ô đã chọn tới booking service.
3. Service kiểm tra đầu vào, đọc sân/lịch từ catalog service và áp dụng quy tắc tính giá. Catalog đọc Model khi dùng MongoDB; chế độ mẫu đọc dữ liệu giả.
4. Controller trả JSON báo giá cho trình duyệt. Với form `POST /quotes`, controller render View `quote.ejs`.

Báo giá vẫn **không tạo booking hoặc giữ ô**. `POST /api/bookings` là chức năng dự kiến: khi làm cần ghi đơn và chiếm tất cả ô trong transaction, không chỉ tái dùng kết quả báo giá rồi đổi màu UI.

## Đã tách nhưng chưa thêm nghiệp vụ thật

- Catalog routes/controller: trang cơ sở, sân và lịch.
- Quote routes/controller: nhận form và hiện báo giá.
- API routes: dữ liệu cơ sở/sân/lịch và báo giá JSON.
- Owner routes/controller: trang đăng nhập chủ sân chưa xác thực.
- Demo routes/controller: thanh toán, phiếu và trang quản lý mẫu; chỉ mở khi `DEMO_MODE=true`.
- `booking.service.js`: tính lịch và báo giá hiện có.
- `catalog.js`: đọc dữ liệu mẫu hoặc MongoDB; `demo-previews.js`: phiên xem thử trong bộ nhớ.

Mỗi ứng dụng nhận services và clock riêng từ `createApp`. Cách này giữ bộ nhớ mẫu tách riêng và cho phép test dùng thời gian cố định; không cần thêm framework.

Các model được tách theo thực thể, vẫn xuất qua `src/models/index.js`. View/CSS/JS và tên URL hiện có giữ nguyên. Các lỗi đầu vào vẫn trả cùng status và thông báo như trước khi tách.

Chưa có đăng nhập/phân quyền thật, API ghi booking/giữ chỗ, thanh toán tự động, hủy/hoàn/đổi, check-in hay báo cáo. MongoDB thật và kết nối MB Bank chưa được kiểm chứng. Cần triển khai/kiểm thử những phần này để hoàn thành final; MVC chỉ là cách tổ chức code.

## Quy tắc khi thêm task

Thêm đường dẫn trong router phù hợp, để controller nhận/trả dữ liệu, service xử lý nghiệp vụ và Model đọc/ghi MongoDB. View hiển thị dữ liệu; không quyết định khách đã trả tiền, giá cuối cùng hay quyền quản lý.

Sửa phần liên quan đến task, thống nhất trước khi sửa thành phần dùng chung. Giữ bộ nhớ demo theo từng ứng dụng và các dependencies được truyền vào. Sau khi sửa code, chạy:

```sh
npm run check
npm test
```

Cách cài và chạy không đổi: dùng Node.js 24, `npm ci`, rồi `npm run dev` hoặc `npm start`.
