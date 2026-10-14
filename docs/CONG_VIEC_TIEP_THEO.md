# Phát triển từ bộ khởi đầu

Mục tiêu là nộp bản final sau 3 tuần, theo `KE_HOACH_3_TUAN.md`. Không coi đây là một hạn chỉ hoàn thành prototype.

1. Chủ repo mời người tham gia và bật Ruleset khi workflow Verify chạy được.
2. Nhóm thống nhất tên trường, trạng thái và API trong tài liệu; chốt chi tiết nghiệp vụ còn mở. Xác minh/chọn kết nối MB trong tuần đầu để kịp tích hợp. Dữ liệu mẫu có nhãn được dùng khi phát triển.
3. Kết nối MongoDB dùng cho phát triển. Kiểm tra seed và đọc dữ liệu; dùng replica set/Atlas để hỗ trợ transaction.
4. Tạo tài khoản chủ sân, đăng nhập/session, logout, chống CSRF và giới hạn dữ liệu theo cơ sở.
5. Triển khai tạo đơn và giữ chỗ trong transaction. Kiểm thử nhiều yêu cầu cùng ô chỉ một đơn thắng; nếu một ô thất bại thì không chiếm các ô còn lại.
6. Thực hiện hết hạn 10 phút và link khách tra cứu/quản lý đơn riêng.
7. Làm màn hình quản lý sân, giá, đơn ngoài web và check-in.
8. Làm hủy/hoàn tiền/đổi lịch sau khi chốt các điểm còn mở.
9. Tích hợp MB khi chọn được kết nối hỗ trợ. Kiểm tra giao dịch lặp, thiếu tiền, sai mã và tiền về sau hết hạn.
10. Cập nhật Word, ERD, state machine theo code; triển khai website, kiểm tra điện thoại và chốt gói nộp final.

Không dùng kết quả test bộ khởi đầu để kết luận đã chống trùng lịch trên MongoDB hoặc đã kiểm tra tiền thật.
