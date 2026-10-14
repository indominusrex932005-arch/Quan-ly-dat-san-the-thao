# Hướng dẫn tiếp nhận dự án

Dự án quản lý đặt sân thể thao. Đọc hướng dẫn này trước khi sửa code. Repo hiện là bộ khởi đầu có luồng xem thử, chưa phải hệ thống đặt sân hoàn chỉnh. Còn 3 tuần là nộp final, không diễn giải thành hạn chỉ nộp prototype. Ngày nộp cụ thể chưa được cung cấp.

## Thứ tự đọc

1. `README.md`: cách chạy, luồng mẫu và giới hạn.
2. `docs/QUY_TAC_PROTOTYPE.md`: quyết định nghiệp vụ và các điểm còn mở.
3. `docs/API.md`: API đã chạy, đường dẫn mẫu và API dự kiến.
4. `docs/KIEN_TRUC_MVC.md`: cấu trúc MVC và nơi sửa từng phần.
5. `CONTRIBUTING.md`: nhánh task, Pull Request và kiểm tra.
6. `docs/CONG_VIEC_TIEP_THEO.md`, `docs/KE_HOACH_3_TUAN.md`, sau đó code/test liên quan đến task.

Dùng tài liệu Markdown hiện hành và yêu cầu mới nhất của nhóm trưởng làm căn cứ. File Word và sơ đồ final cần khớp nghiệp vụ hiện hành và chức năng đã hoàn thành; hiện chưa có bộ cập nhật trong repo. Không phục hồi luồng quản lý duyệt rồi đặt cọc trước đây.

## Công nghệ

- JavaScript ES modules, Node.js 24 LTS, Express 5.
- EJS + Bootstrap 5 + JavaScript/Fetch trên trình duyệt.
- MongoDB Atlas/Mongoose; session dự kiến dùng express-session/connect-mongo, mật khẩu bcrypt.
- Zod kiểm tra đầu vào; Vitest/Supertest kiểm thử.
- Giữ bộ công nghệ này trừ khi task yêu cầu thay đổi. Không thêm React, frontend thứ hai, Supabase hoặc backend Java cho một task nhỏ.

## Cấu trúc code

- `src/server.js` là file khởi động; giữ cách chạy bằng `npm run dev` hoặc `npm start`.
- `src/app.js` chỉ cấu hình Express, tạo services theo từng ứng dụng và gắn routers/middleware. Không dồn xử lý từng màn hình hoặc nghiệp vụ mới vào file này.
- `src/routes/` khai báo URL và HTTP method; `src/controllers/` nhận dữ liệu request, gọi services rồi render EJS/trả JSON.
- `src/services/` xử lý việc đọc dữ liệu, tính lịch/báo giá và hỗ trợ luồng mẫu; `src/domain/` giữ các hàm quy tắc dùng chung. Khi triển khai booking thật, đặt transaction/giữ ô ở service, không làm trong View hoặc route.
- `src/models/` có một file cho mỗi thực thể Mongoose; `index.js` xuất các model để phần dùng hiện có vẫn import được. Không tạo model trùng tên.
- `views/` là View EJS; `public/` chứa CSS/JavaScript phía trình duyệt. Lịch, giá cuối cùng, quyền và trạng thái tiền phải được backend kiểm tra.
- Controllers/routers dùng các dependencies được truyền từ `createApp`; không tạo bộ nhớ phiên mẫu hay clock dùng chung ngoài ứng dụng. Giữ các test chạy được với clock cố định.
- `booking.service.js` hiện chỉ đọc lịch và tính báo giá; chưa tạo booking/SlotLock. Tách MVC không làm các chức năng chưa có trở thành đã triển khai.

## Luồng đơn giản đã thống nhất

Khách chọn sân/ngày/các ô → nhập tên/SĐT → backend giữ tất cả ô 10 phút → xác nhận thông tin → thanh toán 100% → backend xác minh tiền → hiện phiếu đặt sân → khách chụp màn hình → chủ sân tra mã đơn và check-in.

Phiếu có mã đơn, khách, sân/cơ sở/địa chỉ, ngày, từng ô giờ, số tiền và trạng thái. Chủ sân phải kiểm tra đơn thuộc cơ sở mình, đã thanh toán và chưa check-in trên hệ thống. Ảnh chụp hoặc mã công khai không cấp quyền hủy/đổi; link quản lý đơn dùng token riêng. Không cần thêm ứng dụng quét QR check-in cho luồng cơ bản.

Khách hỏi qua Zalo được gửi link đặt sân. Form nhập đơn trực tiếp là phương án cho trường hợp vẫn nhận đơn/tiền ngoài web; không tích hợp đọc Zalo và không coi gửi link là đã nhập đơn vào database.

## Những quy tắc dễ làm sai

- Nhiều cơ sở, một tài khoản chủ sân cho mỗi cơ sở, mỗi cơ sở có nhiều sân con. Phạm vi quản lý lấy từ session và kiểm tra ở backend, không tin `facilityId` client gửi.
- Khách không cần tài khoản, nhập tên/SĐT. Khách quản lý đơn qua token riêng khó đoán; chỉ lưu hash token. Số điện thoại không phải quyền hủy đơn.
- Ô lịch 30 phút, thuê tối thiểu một ô. Một đơn chọn được các ô rời nhau; không giữ/tính tiền ô nằm giữa mà khách không chọn.
- Không duyệt đơn web. Khi tạo đơn thật, chiếm toàn bộ ô trong transaction và lưu khách, trạng thái WAITING_PAYMENT.
- Giữ chỗ 10 phút; hết hạn chưa trả thì giải phóng ô. LOCKED phải có hạn; booked vẫn giữ lịch nếu khách không đến theo cách hiểu tạm, còn cần xác nhận chính sách.
- Xác nhận đơn web sau khi backend xác minh nhận đủ tiền. Nút khách bấm, ảnh QR và phiếu mẫu không chứng minh đã nhận tiền.
- Đổi lịch thu 30.000đ + chênh lệch dương; giá mới thấp hơn không hoàn chênh lệch. Giữ đơn cũ cho đến khi đổi thành công.
- Hủy từ 24 giờ trước giờ chơi hoàn 100%; dưới 24 giờ nhưng chưa bắt đầu hoàn 50%. Đến trễ/không đến không hoàn. Chủ sân hoàn trực tiếp trong 48 giờ; mốc tính 48 giờ và các chi tiết còn mở phải chốt.
- Nếu nhận đơn ngoài web, chủ sân tự kiểm tra tiền và nhập đơn để đánh dấu booked; backend kiểm tra trống, không ghi đè ô đã giữ/đặt.
- MB Bank chưa kết nối, nhà cung cấp chưa chốt. Không tạo webhook không xác thực hoặc cho môi trường thật xác nhận tiền bằng nút mô phỏng.
- Thanh toán tự động là yêu cầu final. Chế độ mẫu không đáp ứng yêu cầu này; không tự giảm phạm vi final thành bản mô phỏng.

## Phần đã có và chưa có

Đã có: dữ liệu mẫu, chọn cơ sở/sân/ngày/ô giờ, form khách, báo giá backend, API đọc/báo giá, schema và hàm tính phí. Luồng `/demo/...` cho xem trang thanh toán, phiếu và quản lý mẫu.

Phiên xem thử chỉ lưu trong bộ nhớ: có 10 phút để mở phiếu mẫu, dữ liệu được giữ tối đa một giờ và mất khi server khởi động lại. Không tạo booking, không chiếm SlotLock, không ghi Atlas và không xử lý tiền. Tất cả đường dẫn `/demo/...` chỉ mở khi `DEMO_MODE=true`; không đưa nút **Xem phiếu mẫu** vào luồng thanh toán thật.

Chưa có: xác thực chủ sân, API ghi booking/transaction giữ chỗ thật, thanh toán, CRUD quản lý, hủy/đổi/check-in và báo cáo. Trang đăng nhập chưa xác thực; `/quotes` và `/api/quotes` không tạo booking. Trang `/demo/owner` chỉ là bố cục đọc dữ liệu mẫu, không thay thế dashboard có phân quyền.

Không báo một chức năng đã hoàn thành chỉ vì có schema, giao diện hoặc endpoint trong mục “Dự kiến”.

## Làm một task

- Đọc phạm vi và tiêu chí đạt; sửa các file liên quan. Giữ tên trường/API/trạng thái đã thống nhất, cập nhật tài liệu khi đổi hợp đồng dữ liệu.
- Dùng dữ liệu mẫu có nhãn. Không đưa thông tin khách thật/cấu hình riêng vào repo.
- Làm trên nhánh task, gửi PR vào main. Chỉ sửa file thuộc phạm vi; báo trước nếu cần đổi thành phần dùng chung.
- Không sửa test để che lỗi. Kiểm thử phù hợp với thay đổi; tài liệu đơn giản không cần thêm test.
- Unique index không chứng minh chống trùng. API ghi đơn cần kiểm thử thật với MongoDB replica set và nhiều yêu cầu đồng thời.
- Báo file đã sửa, cách kiểm tra, kết quả và phần chưa hoàn thành. Ghi giả định khi chính sách chưa chốt để nhóm trưởng quyết định.

## Cài và chạy

```sh
npm ci
npm run dev
```

Mẫu chạy không cần credentials. `npm start` chạy không watch. Kết nối MongoDB theo README, không seed production. Không commit `.env`, connection string hoặc khóa dịch vụ.

```sh
npm run check
npm test
```

Đây là kiểm tra trước PR có sửa code. Bổ sung kiểm tra khi task yêu cầu và báo những kiểm tra chưa chạy được.
