# Kế hoạch hoàn thành bản final trong 3 tuần

Nhóm trưởng xác nhận: còn 3 tuần là nộp bản final. Đây là thời gian hoàn thành và nộp dự án, không phải hạn làm prototype. Ngày nộp cụ thể chưa được cung cấp, nên kế hoạch dùng tuần tương đối và không tự gán hạn 03/11.

Mục tiêu: website có các chức năng đã thống nhất, dữ liệu lưu thật trên MongoDB, được triển khai và kiểm thử, kèm báo cáo/hướng dẫn nộp. Dữ liệu mẫu và thao tác mô phỏng chỉ phục vụ phát triển, không đáp ứng tiêu chí hoàn thành bản final.

## Tuần 1 – hoàn thành nền tảng và đặt sân

- Mời người tham gia, bật Ruleset cho main; kiểm tra PR lỗi bị chặn.
- Tất cả clone và chạy bộ khởi đầu, giao task qua Issues và bàn giao qua PR.
- Kết nối MongoDB phát triển dùng replica set/Atlas; kiểm tra seed và đọc dữ liệu.
- Hoàn thành đăng nhập chủ sân, giới hạn dữ liệu theo cơ sở và cập nhật sân/giá.
- Làm API tạo đơn lưu tên/SĐT, giữ toàn bộ ô chọn trong transaction và hết hạn 10 phút.
- UI khách nối API thật, không coi API báo giá hiện có là đã tạo đơn.
- Chốt những chi tiết hủy/đổi còn mở và chọn kết nối giao dịch hỗ trợ tài khoản MB. Kiểm tra khả năng đăng ký, cấu hình và điều kiện sử dụng ngay trong tuần này để có thời gian tích hợp; chưa cần tích hợp trước các phần độc lập.

Đầu ra phải kiểm tra: tạo đơn rời ô; chỉ giữ ô đã chọn; nhiều yêu cầu cùng một ô chỉ một đơn giữ được; thất bại một ô không chiếm các ô còn lại; hết hạn mở lại ô; chủ sân không sửa được cơ sở khác.

## Tuần 2 – hoàn thành các chức năng chính

- Làm danh sách/chi tiết đơn, nhập đơn Zalo/tại quầy, ghi nhận tiền ngoài web và check-in.
- Làm link quản lý đơn riêng của khách; kiểm tra không dùng SĐT đơn thuần để cấp quyền hủy.
- Làm hủy, ghi nhận tiền cần hoàn và việc chủ sân chuyển hoàn; đổi lịch thu đúng phí và giữ lịch cũ cho đến khi đổi thành công.
- Tích hợp kết nối giao dịch đã chọn: QR đúng đơn/số tiền, nhận và xác thực webhook, đối chiếu giao dịch và xác nhận đơn tự động. Hoàn thiện trang kết quả thanh toán và giải quyết trường hợp tiền về sau hết hạn.
- Làm báo cáo cơ bản theo dữ liệu đã ghi nhận, phân biệt tiền thu và tiền cần hoàn.

Đầu ra: các luồng khách đặt/thanh toán/tra cứu/hủy/đổi và chủ sân quản lý/nhập đơn ngoài/check-in hoạt động với dữ liệu lưu thật. Các phần phải được ghép vào website trước khi bước sang tuần cuối.

## Tuần 3 – kiểm thử, triển khai và nộp final

- Đầu tuần: triển khai website HTTPS, kiểm tra cấu hình MongoDB/session/webhook và thao tác trên điện thoại.
- Kiểm thử toàn bộ nghiệp vụ trên bản triển khai, sửa lỗi và lưu bằng chứng chạy; các test MongoDB/đặt đồng thời/thanh toán phải được thực hiện, không suy ra từ test bộ khởi đầu.
- Cập nhật requirement, ERD, state machine, phân tích/ phạm vi, workflow và hướng dẫn sử dụng để khớp bản đã làm.
- Kiểm tra báo cáo và kiến thức giải thích của từng thành viên. Ghi đúng kết quả khảo sát và những giới hạn còn tồn tại.
- Hai ngày cuối: chốt code, chỉ sửa lỗi; kiểm tra đường dẫn website, mã nguồn, cấu hình mẫu và các file phải nộp.

Các ca quan trọng: đặt đồng thời, lock hết hạn, ô rời nhau, giá qua giờ cao điểm, quyền theo cơ sở, khách xem/hủy đúng đơn, mốc hủy 24 giờ, phí đổi, đổi thất bại giữ lịch cũ và đơn ngoài không chiếm trùng ô đã giữ.

Thanh toán tự động vẫn là yêu cầu bản final theo lựa chọn của nhóm trưởng. Kết nối MB chưa được xác minh là một phụ thuộc phải xử lý sớm. Nếu không đáp ứng được, báo ngay để nhóm trưởng quyết định thay đổi phạm vi; không tự thay bằng nút thanh toán mô phỏng hoặc coi giao diện QR là chức năng đã hoàn thành.

## Tiêu chí chốt bản final

- Một tài khoản mỗi cơ sở; quản lý không truy cập/sửa dữ liệu cơ sở khác.
- Khách không cần tài khoản, lưu tên/SĐT và danh sách ô rời nhau đúng giá.
- Giữ chỗ 10 phút, chống trùng trong database, hết hạn mở lại ô.
- Thanh toán toàn bộ được xác nhận từ giao dịch hợp lệ; chống ghi nhận hai lần.
- Đơn ngoài web, check-in, hủy/hoàn và đổi lịch xử lý theo quy tắc đã chốt.
- Báo cáo cơ bản, website triển khai và tài liệu nộp khớp code.
- Không còn lỗi chặn các luồng chính; ghi rõ mọi phần chưa hoàn thành thay vì đánh dấu hoàn tất.

## Theo dõi mỗi ngày

- Một task có mục tiêu, phạm vi, hạn và tiêu chí đạt; có mẫu trong Issues → New issue.
- Mỗi người báo ngắn: phần chạy được, link PR và việc đang vướng.
- Nhóm trưởng review/ghép từng phần đã đạt; không chờ đến tuần cuối mới ghép.
- Quy tắc/API thay đổi phải cập nhật tài liệu để các AI và thành viên đọc cùng một phiên bản.
