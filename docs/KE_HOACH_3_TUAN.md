# Kế hoạch prototype 3 tuần

Lịch nội bộ đề xuất: 14/10/2026–03/11/2026. Chưa xác nhận đây là hạn nộp của môn. Nếu hạn khác, nhóm trưởng cập nhật ngày nhưng giữ thứ tự phụ thuộc.

Mục tiêu: prototype chạy liền mạch trên database phát triển, giải thích được nghiệp vụ và có bằng chứng kiểm thử. Không mặc định rằng kết nối ngân hàng thật sẽ sẵn sàng trong thời gian này.

## Tuần 1: 14–20/10 – database và đặt sân

- Mời 3 thành viên, bật Ruleset cho main; kiểm tra PR lỗi bị chặn.
- Tất cả clone và chạy bộ khởi đầu, giao task qua Issues và bàn giao qua PR.
- Kết nối MongoDB phát triển dùng replica set/Atlas; kiểm tra seed và đọc dữ liệu.
- Làm đăng nhập chủ sân, giới hạn dữ liệu theo cơ sở; chuẩn bị form cập nhật sân/giá.
- Làm API tạo đơn lưu tên/SĐT, giữ toàn bộ ô chọn trong transaction và hết hạn 10 phút.
- UI khách nối API thật, không coi API báo giá hiện có là đã tạo đơn.

Đầu ra phải kiểm tra: tạo đơn rời ô; chỉ giữ ô đã chọn; nhiều yêu cầu cùng một ô chỉ một đơn giữ được; thất bại một ô không chiếm các ô còn lại; hết hạn mở lại ô; chủ sân không sửa được cơ sở khác.

## Tuần 2: 21–27/10 – quản lý và vòng đời đơn

- Làm danh sách/chi tiết đơn, nhập đơn Zalo/tại quầy, ghi nhận tiền ngoài web và check-in.
- Làm link quản lý đơn riêng của khách; kiểm tra không dùng SĐT đơn thuần để cấp quyền hủy.
- Chốt chi tiết hủy/đổi còn mở trong tài liệu quy tắc rồi làm xử lý phí, hoàn tiền và giữ lịch cũ khi đổi.
- Hoàn thiện UI xác nhận/thanh toán. Nếu chưa có kết nối MB, thao tác mô phỏng phải được ghi rõ và giới hạn môi trường demo; không sử dụng với tiền thật.
- Làm báo cáo cơ bản theo dữ liệu đã ghi nhận, phân biệt tiền thu và tiền cần hoàn.

Đầu ra: demo được luồng khách từ chọn giờ đến kết quả thanh toán mô phỏng, tra cứu/hủy; luồng chủ sân xem đơn và nhập đơn ngoài. Dữ liệu và trạng thái phải thống nhất giữa UI/database.

## Tuần 3: 28/10–03/11 – ghép, sửa lỗi và nộp

- Đến 30/10: ghép các phần cốt lõi, kiểm tra trên điện thoại và dữ liệu MongoDB; sửa lỗi chặn demo.
- Đến 01/11: hoàn thành các ca kiểm thử nghiệp vụ, có bằng chứng chạy; cập nhật requirement, ERD, state machine và hướng dẫn sử dụng.
- Ngày 02/11: chạy thử toàn bộ bài trình bày; mỗi thành viên giải thích phần mình làm.
- Ngày 03/11: dành cho lỗi cuối và chốt bản nộp; tránh thêm chức năng lớn.

Các ca quan trọng: đặt đồng thời, lock hết hạn, ô rời nhau, giá qua giờ cao điểm, quyền theo cơ sở, khách xem/hủy đúng đơn, mốc hủy 24 giờ, phí đổi, đổi thất bại giữ lịch cũ và đơn ngoài không chiếm trùng ô đã giữ.

Nếu tích hợp MB trong giai đoạn này, bổ sung kiểm tra giao dịch lặp/sai mã/thiếu tiền/đến sau hết hạn. Nếu chưa tích hợp, báo cáo rõ giới hạn prototype; không coi giao diện QR là đã thanh toán tự động.

## Theo dõi mỗi ngày

- Một task có mục tiêu, phạm vi, hạn và tiêu chí đạt; có mẫu trong Issues → New issue.
- Mỗi người báo ngắn: phần chạy được, link PR và việc đang vướng.
- Nhóm trưởng review/ghép từng phần đã đạt; không chờ đến tuần cuối mới ghép.
- Quy tắc/API thay đổi phải cập nhật tài liệu để các AI và thành viên đọc cùng một phiên bản.
