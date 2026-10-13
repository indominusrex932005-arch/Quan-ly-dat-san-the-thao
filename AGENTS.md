# Hướng dẫn tiếp nhận dự án

Dự án quản lý đặt sân thể thao cho môn System và Advanced Web, nhóm 4 người. Đọc hướng dẫn này trước khi sửa code. Repo hiện là bộ khởi đầu, chưa phải hệ thống đặt sân hoàn chỉnh.

## Thứ tự đọc

1. `README.md`: cách chạy, cấu trúc và giới hạn hiện tại.
2. `docs/QUY_TAC_PROTOTYPE.md`: quyết định nghiệp vụ và các điểm còn mở.
3. `docs/API.md`: phân biệt API đã chạy với API dự kiến.
4. `CONTRIBUTING.md`: nhánh task, Pull Request và kiểm tra.
5. `docs/CONG_VIEC_TIEP_THEO.md`, sau đó code/test liên quan đến task.

File Word và hình cũ trong `docs/` chưa cập nhật theo phương án hiện tại. Khi có mâu thuẫn, dùng tài liệu Markdown hiện hành và yêu cầu mới nhất của nhóm trưởng. Không khôi phục bước quản lý duyệt đơn chỉ vì thấy trong tài liệu cũ.

## Công nghệ hiện tại

- JavaScript ES modules, Node.js 24 LTS, Express 5.
- EJS + Bootstrap 5 + JavaScript/Fetch trên trình duyệt.
- MongoDB Atlas/Mongoose; session dự kiến dùng express-session/connect-mongo, mật khẩu bcrypt.
- Zod kiểm tra đầu vào; Vitest/Supertest kiểm thử.
- Giữ bộ công nghệ này trừ khi task yêu cầu thay đổi. Không thêm React, EJS frontend thứ hai, Supabase hoặc backend Java để thực hiện một task nhỏ.

## Những quy tắc dễ làm sai

- Nhiều cơ sở, một tài khoản chủ sân cho mỗi cơ sở, mỗi cơ sở có nhiều sân con. Backend quản lý cần lấy phạm vi cơ sở từ session và kiểm tra quyền, không tin facilityId do client gửi.
- Khách không cần tài khoản, nhập tên và số điện thoại. Khách quản lý đơn qua token riêng khó đoán; số điện thoại không phải quyền hủy đơn.
- Ô lịch 30 phút. Một đơn có thể chọn các ô rời nhau. Không giữ hoặc tính tiền các ô nằm giữa mà khách không chọn.
- Không có duyệt đơn web. Khi tạo đơn thật phải giữ toàn bộ ô trong transaction, lưu khách và trạng thái WAITING_PAYMENT.
- Giữ chỗ 10 phút; hết hạn chưa trả thì giải phóng ô. LOCKED phải có thời hạn; booked vẫn giữ lịch nếu khách không đến.
- Xác nhận đơn web sau khi backend xác minh nhận đủ tiền. Nút khách bấm hoặc ảnh QR không chứng minh đã nhận tiền.
- Đổi lịch thu 30.000đ + chênh lệch dương; giá mới thấp hơn không hoàn chênh lệch trong prototype. Giữ đơn cũ cho đến khi đổi thành công.
- Hủy từ 24 giờ trước giờ chơi hoàn 100%; dưới 24 giờ nhưng chưa bắt đầu hoàn 50%. Đến trễ/không đến không hoàn. Những chi tiết chưa xác định nằm trong tài liệu quy tắc, không coi giả định làm prototype là chính sách đã xác nhận.
- Chủ sân nhập đơn Zalo/tại quầy, đánh dấu booked và tự ghi nhận tiền nhận ngoài web.
- MB Bank chưa được kết nối. Không dựng một webhook không xác thực hoặc cho môi trường thật xác nhận tiền bằng nút mô phỏng.

## Phần đã có và chưa có

Đã có: dữ liệu mẫu, trang chọn cơ sở/sân/ngày/ô giờ, form khách, báo giá backend, API đọc/báo giá, schema và hàm tính phí.

Chưa có: xác thực chủ sân, tạo đơn/transaction giữ chỗ thật, thanh toán, CRUD quản lý, hủy/đổi/check-in, báo cáo. Trang đăng nhập hiện bị vô hiệu hóa có chủ đích; `/quotes` và `/api/quotes` không tạo booking.

Không báo rằng một chức năng đã hoàn thành chỉ vì có schema, giao diện hoặc endpoint trong mục "Dự kiến".

## Làm một task

- Đọc phạm vi và tiêu chí đạt của task; sửa các file liên quan. Giữ tên trường/API/trạng thái đã thống nhất, cập nhật tài liệu nếu task thay đổi hợp đồng dữ liệu.
- Dùng dữ liệu mẫu có nhãn. Không đưa thông tin khách thật hoặc cấu hình riêng vào repo.
- Làm trên nhánh task; gửi Pull Request vào main theo hướng dẫn làm nhóm.
- Không sửa test để che lỗi. Viết/chạy kiểm thử phù hợp với thay đổi nghiệp vụ; thay đổi tài liệu đơn giản không cần thêm test.
- Không coi schema unique index là bằng chứng đã chống trùng lịch. Phần ghi đơn cần kiểm thử thật với MongoDB replica set và nhiều yêu cầu đồng thời.
- Báo các file đã sửa, cách kiểm tra, kết quả và phần chưa hoàn thành. Với quy tắc chưa chốt, ghi rõ giả định dùng cho prototype.

## Cài và chạy

```sh
npm ci
npm run dev
```

Chế độ mẫu chạy không cần credentials. Có thể dùng `npm start` để chạy không watch. Kết nối MongoDB riêng theo README, không seed production. Không commit `.env`, connection string hoặc khóa dịch vụ.

```sh
npm run check
npm test
```

Hai lệnh trên là kiểm tra trước Pull Request có sửa code. Dùng kiểm tra bổ sung khi task có yêu cầu; báo rõ những kiểm tra chưa chạy được.
