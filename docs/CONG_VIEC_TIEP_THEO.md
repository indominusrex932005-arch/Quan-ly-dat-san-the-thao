# Phát triển tiếp và giao task UI

Mục tiêu là nộp final sau 3 tuần theo `KE_HOACH_3_TUAN.md`, không chỉ hoàn thành prototype. Giao diện mẫu đang có để chạy thử và thống nhất cách dùng; nghiệp vụ thật cần API, dữ liệu lưu và kiểm thử tương ứng.

Code đã tách MVC. Đọc [cấu trúc và nơi sửa code](KIEN_TRUC_MVC.md) trước khi nhận task; việc tách này giữ luồng hiện có, không thay thế phần nghiệp vụ thật còn thiếu.

## Luồng cần giữ

Chọn sân/ngày/ô → tên/SĐT → backend giữ chỗ 10 phút → xác nhận → thanh toán 100% → backend xác minh tiền → phiếu đặt sân → chủ sân tra mã và check-in.

Khách nhắn Zalo nhận link web để tự đặt. **Thêm đơn trực tiếp** chỉ cần nếu chủ sân vẫn nhận đặt/thu tiền ngoài web; không tạo thêm luồng tự đọc Zalo hoặc quét ảnh chuyển khoản. Ảnh phiếu giúp tra cứu, không thay xác nhận ngân hàng.

## Chia task UI theo phần

Nhóm trưởng giữ header/footer, thiết kế chung, route/hợp đồng API và việc ghép backend. Mỗi task có người nhận, hạn và tiêu chí đạt trong Issue; không cùng sửa thành phần dùng chung khi chưa thống nhất. Bàn giao PR nhỏ, khoảng một hoặc hai màn hình.

| Phần | Màn hình | Tiêu chí đạt |
|---|---|---|
| Chọn sân | Cơ sở, sân, lịch, form tên/SĐT | Chọn được ô rời nhau; không chọn booked/locked; hiện tổng thời lượng/giá dự kiến; dùng trên điện thoại |
| Xác nhận/thanh toán/phiếu | Thông tin khách/sân/địa chỉ/ngày/ô, QR, đồng hồ, trạng thái, phiếu | Giá từ backend; phân biệt chờ/đã xác nhận/hết hạn; không tự đánh dấu đã trả tiền; phiếu dễ chụp màn hình |
| Quản lý | Đăng nhập, lịch/danh sách đơn, tra mã và check-in | Lọc ngày, tìm mã; hiện trạng thái tiền/check-in; thao tác thật chỉ qua API có quyền |
| Tiếp theo | Quản lý sân/giá, hủy/đổi, ghi nhận hoàn và báo cáo | Thực hiện đúng chính sách/hợp đồng API; ghi rõ phần chưa có |

Form đơn ngoài web là task bổ sung khi có nhu cầu; đầu vào tên/SĐT, sân/ngày/ô, số tiền nhận và phương thức. Phải kiểm tra lịch trống, không chỉ đổi màu UI.

Với API chưa có, dùng dữ liệu mẫu có nhãn và liệt kê điểm cần nối. Không dùng kết quả `/demo/confirm` cho luồng thanh toán thật. Từng PR bàn giao ảnh desktop/điện thoại, thao tác đã kiểm tra và phần còn thiếu. Chạy `npm run check` và `npm test` khi sửa code.

## Chia phần code theo MVC

| Task | Nơi làm chính |
|---|---|
| UI chọn cơ sở/sân/lịch | `views/home.ejs`, `facility.ejs`, `court.ejs` và CSS/JS liên quan trong `public/` |
| UI xác nhận/thanh toán/phiếu | `views/quote.ejs`, `demo-payment.ejs`, `demo-receipt.ejs`; trang mẫu dùng demo controller, trang thật cần dữ liệu booking thật |
| UI chủ sân | `views/owner-login.ejs`, `demo-owner.ejs`; controller/routes chủ sân sẽ phát triển tiếp sau khi có login/phân quyền |
| API và nghiệp vụ | Routes/controller theo chức năng, `src/services/`, `src/domain/`; giá, giữ chỗ, thanh toán và quyền kiểm tra ở backend |
| Database | `src/models/`, dữ liệu truy vấn/transaction trong services; giữ tên trường theo hợp đồng API |

Thêm URL vào router tương ứng và xử lý request trong controller; không đưa toàn bộ chức năng mới vào `app.js`. Khi thêm chức năng thật, tách rõ với `/demo/...`, cập nhật hợp đồng dữ liệu và báo phần UI cần nối. Header/footer, CSS chung và việc gắn router mới vẫn cần thống nhất trước khi sửa.

## Thứ tự triển khai nghiệp vụ

1. Kiểm tra mọi người chạy được repo, hiểu tài liệu hiện hành và quy trình PR.
2. Chốt tên trường/trạng thái/API, những điểm nghiệp vụ còn mở. Chọn/xác minh dịch vụ giao dịch MB trong tuần đầu để kịp tích hợp.
3. Kết nối MongoDB phát triển; kiểm tra seed/đọc dữ liệu, dùng replica set/Atlas cho transaction.
4. Tạo tài khoản chủ sân, login/session/logout, chống CSRF và giới hạn dữ liệu theo cơ sở.
5. API tạo đơn/giữ chỗ trong transaction: nhiều request cùng ô chỉ một đơn thắng, một ô thất bại không chiếm các ô còn lại.
6. Hết hạn 10 phút, link khách quản lý đơn riêng, nối UI xác nhận/đếm hạn vào booking thật.
7. Thanh toán đúng QR/mã/số tiền, xác thực giao dịch, xử lý lặp/thiếu/sai mã/tiền về sau hết hạn; trả phiếu thật khi đã xác nhận.
8. Quản lý sân/giá/đơn, tra mã và check-in. Nhập đơn ngoài web nếu vẫn nhận; tự kiểm tra tiền ngoài web.
9. Hủy/hoàn/đổi sau khi chốt điểm còn mở; giữ lịch cũ đến khi đổi thành công, báo cáo thu/hoàn theo dữ liệu.
10. Use case, requirement, ERD/state machine theo luồng thật; triển khai HTTPS, kiểm tra điện thoại và chốt gói nộp.

Đơn giản màn hình để dễ dùng; giữ các quy tắc nghiệp vụ, API, quyền truy cập, database và kiểm thử. Không suy ra chống trùng MongoDB hoặc xác minh tiền thật từ việc có giao diện/QR/check xanh.
