# Kế hoạch hoàn thành final trong 3 tuần

Còn 3 tuần là nộp final, không phải hạn chỉ làm prototype. Ngày nộp cụ thể chưa được cung cấp, nên kế hoạch dùng tuần tương đối.

Mục tiêu: website thực hiện các chức năng đã thống nhất, dữ liệu lưu trên MongoDB, được triển khai/kiểm thử và có báo cáo/hướng dẫn. Dữ liệu mẫu và nút **Xem phiếu mẫu** phục vụ phát triển, không đáp ứng tiêu chí thanh toán/đặt sân thật.

Luồng chính: chọn sân/ngày/ô → tên/SĐT → giữ chỗ 10 phút → xác nhận → thanh toán 100% → backend xác minh tiền → phiếu đặt sân → chủ sân tra mã và check-in. Không thêm duyệt đơn web hay tài khoản khách.

## Tuần 1 – nền tảng và đặt sân

- Kiểm tra quyền tham gia, Ruleset/CI, clone/chạy app; giao task nhỏ qua Issues/PR.
- Thống nhất giao diện đơn giản và dữ liệu từng trang; hoàn thiện chọn sân, xác nhận, thanh toán/phiếu, quản lý mẫu rồi nối phần API đã có.
- Kết nối MongoDB replica set/Atlas; kiểm tra seed và đọc dữ liệu.
- Đăng nhập chủ sân, quyền theo cơ sở, cập nhật sân/giá.
- Tạo đơn lưu tên/SĐT, giữ toàn bộ ô chọn trong transaction, hết hạn 10 phút.
- Chốt chi tiết hủy/đổi/hoàn còn mở, chọn dịch vụ giao dịch MB và kiểm tra khả năng đăng ký/cấu hình ngay trong tuần.

Đầu ra kiểm tra được: đơn rời ô chỉ giữ ô đã chọn; tranh cùng ô chỉ một đơn thắng; một ô lỗi không chiếm các ô khác; hết hạn mở lại; chủ sân không sửa cơ sở khác. Báo giá và phiên demo không thay cho việc tạo booking thật.

## Tuần 2 – hoàn thành các luồng chính

- Nối thanh toán với dịch vụ đã chọn: QR đúng đơn/tiền, webhook xác thực, đối chiếu giao dịch và xác nhận một lần. Xử lý tiền về sau hết hạn.
- Phiếu thật hiện mã đơn, tên/SĐT, sân/địa chỉ, ngày, từng ô, tiền/trạng thái; khách chụp màn hình.
- Chủ sân xem/lọc đơn, tra mã và check-in trên hệ thống; chống check-in lặp. Ảnh không thay việc đối chiếu đơn hợp lệ.
- Link quản lý đơn riêng cho khách, không dùng SĐT/mã công khai làm quyền hủy/đổi.
- Hủy, nghĩa vụ hoàn và ghi nhận chủ sân chuyển hoàn; đổi thu phí đúng, giữ lịch cũ đến khi thành công.
- Nhập đơn trực tiếp nếu vẫn nhận đặt/tiền ngoài web. Nếu ưu tiên hoàn toàn web, gửi link cho khách hỏi Zalo để họ tự đặt.
- Báo cáo cơ bản theo dữ liệu đã ghi, phân biệt tiền thu/hoàn.

Đầu ra: các luồng khách đặt/thanh toán/phiếu/tra cứu/hủy/đổi và chủ sân quản lý/check-in hoạt động với dữ liệu thật trước tuần cuối. Chức năng ngoài web nếu còn trong phạm vi cũng phải được ghép/kiểm tra.

## Tuần 3 – kiểm thử, triển khai và nộp

- Đầu tuần triển khai HTTPS, kiểm tra cấu hình MongoDB/session/webhook, thao tác trên điện thoại.
- Kiểm thử nghiệp vụ trên bản triển khai, sửa lỗi, lưu bằng chứng. Chạy kiểm thử MongoDB/đặt đồng thời/thanh toán; không suy ra từ test mẫu.
- Cập nhật requirement, use case, ERD, state machine, phân tích/phạm vi, workflow và hướng dẫn khớp code.
- Kiểm tra báo cáo và khả năng giải thích từng phần; ghi đúng khảo sát và giới hạn thực tế.
- Hai ngày cuối chốt code, chỉ sửa lỗi; kiểm tra link web, mã nguồn, cấu hình mẫu và gói nộp.

Các ca quan trọng: đặt đồng thời, lock hết hạn, ô rời nhau, giá qua giờ cao điểm, quyền cơ sở, khách xem/hủy đúng đơn, mốc 24 giờ, phí đổi, đổi thất bại giữ lịch cũ, webhook lặp/sai/thiếu và check-in lặp. Nếu có đơn ngoài, kiểm tra không chiếm trùng ô đã giữ.

Thanh toán tự động là yêu cầu final. Kết nối MB chưa được xác minh là phụ thuộc cần xử lý sớm; nếu không đáp ứng, báo nhóm trưởng quyết định phạm vi, không tự thay bằng mô phỏng hoặc coi QR là hoàn thành.

## Tiêu chí chốt final

- Một tài khoản mỗi cơ sở, quản lý không truy cập/sửa dữ liệu cơ sở khác.
- Khách không cần tài khoản; tên/SĐT, ô rời nhau và giá lưu đúng.
- Giữ chỗ 10 phút, chống trùng database, hết hạn mở lại ô.
- Thanh toán toàn bộ xác nhận từ giao dịch hợp lệ, không ghi nhận hai lần.
- Phiếu đặt sân và check-in đối chiếu bản ghi hợp lệ.
- Hủy/hoàn/đổi xử lý theo quy tắc; đơn ngoài web nếu còn nhận cũng được quản lý.
- Báo cáo cơ bản, website triển khai và tài liệu khớp code; ghi rõ phần chưa hoàn thành.

## Theo dõi mỗi ngày

- Task có mục tiêu, phạm vi, hạn và tiêu chí đạt; dùng mẫu Issues.
- Báo phần chạy được, link PR và việc vướng; ghép phần đã đạt sớm.
- Quy tắc/API đổi phải cập nhật tài liệu để người và AI đọc cùng phiên bản.
