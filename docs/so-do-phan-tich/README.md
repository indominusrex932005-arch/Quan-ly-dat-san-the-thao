# Persona, Use Case và ERD

Bản thiết kế ngày 16/10/2026. Bộ này mô tả chức năng mục tiêu và cấu trúc model hiện có; không phải xác nhận mọi chức năng đã triển khai.

## Mở và tải

- `Bo_so_do_Persona_UseCase_ERD.zip`: tải toàn bộ hình và bản SVG.
- PNG: xem nhanh, chèn vào báo cáo.
- SVG: phóng to không vỡ chữ; mở bằng trình duyệt hoặc công cụ vẽ vector.

| File | Nội dung |
|---|---|
| persona_nguoi_choi | Các nhóm hành vi của người chơi |
| persona_chu_san | Chủ sân và người vận hành |
| use_case_nguoi_choi | Chức năng của người chơi và dịch vụ thanh toán |
| use_case_chu_san | Chức năng quản lý của chủ sân |
| erd_dat_san | Dữ liệu dùng chung cho cả hai phía |

## Căn cứ và giới hạn

Persona được tổng hợp từ bảng persona được cung cấp, chưa đối chiếu toàn bộ phiếu phỏng vấn gốc. Hành vi như trả tiền tại quầy là mô tả hiện trạng, không tự trở thành yêu cầu của website. Không tự thêm độ tuổi, nghề nghiệp, thu nhập hoặc lời phỏng vấn.

Luồng mục tiêu: khách không cần tài khoản; chọn các ô 30 phút, nhập tên/SĐT, giữ chỗ 10 phút, trả 100%, backend xác minh tiền và hiện phiếu. Đơn web không cần chủ sân duyệt. Chủ sân đăng nhập, chỉ quản lý cơ sở mình. Hoàn tiền do chủ sân chuyển trực tiếp rồi ghi nhận trên web. Persona người trực quầy không có nghĩa đã bổ sung tài khoản nhân viên.

Hai hình Use Case là hai góc nhìn của cùng hệ thống. Mã UC01–UC14 dùng trong bộ hình này; khi ghép với tài liệu khác cần thống nhất lại mã. Các chức năng quản lý yêu cầu đăng nhập; không dùng quan hệ include/extend để biểu diễn thứ tự thao tác. Nhập đơn ngoài web là chức năng bổ sung có điều kiện nếu chủ sân vẫn nhận đơn/tiền ngoài website; không nằm trong hai hình cơ bản này.

ERD rút gọn theo các model Facility, User, Court, Booking, SlotLock, Payment và Refund. Tên/SĐT khách và mảng slots nằm trong Booking; không có collection tài khoản khách hoặc PriceRules riêng. SlotLock có unique index (courtId, slotStart), nhưng cần transaction và kiểm thử đồng thời để bảo đảm chống trùng. User.facilityId unique giới hạn tối đa một tài khoản mỗi cơ sở; khi đưa cơ sở vào hoạt động phải cấp tài khoản. Booking.facilityId phải phù hợp với cơ sở của Court, backend cần kiểm tra.

Cần chốt tiếp: nhà cung cấp và các trường hợp thanh toán sai/thiếu/muộn; hạn cuối được đổi; mốc bắt đầu 48 giờ hoàn; hủy/đổi từng ô hay cả đơn rời nhau. Theo dõi nghiệp vụ hiện hành trong docs/QUY_TAC_PROTOTYPE.md và chức năng/API trong docs/API.md.

Empathy Map hỗ trợ phân tích nhưng không thay thế requirement, Use Case hoặc ERD. Bổ sung nếu yêu cầu đánh giá của môn học có mục này; phân biệt lời khảo sát với suy luận của nhóm.
