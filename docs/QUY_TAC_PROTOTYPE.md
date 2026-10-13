# Quy tắc prototype – cập nhật 14/10/2026

Đây là lựa chọn thiết kế của nhóm, không coi là kết quả phỏng vấn chủ sân. Prototype có thể được điều chỉnh sau.

## Đã thống nhất

- Nhiều cơ sở, trước mắt cầu lông; có thể mở rộng pickleball.
- Mỗi cơ sở có một tài khoản chủ sân, cơ sở có nhiều sân con. Chủ sân chỉ quản lý cơ sở mình.
- Chủ sân cập nhật tên sân, địa chỉ cơ sở, giờ mở cửa và giá.
- Khách không cần tài khoản; nhập họ tên và số điện thoại.
- Ô lịch 30 phút, thuê tối thiểu 1 ô; chọn các ô rời nhau được.
- Không có bước quản lý duyệt đơn web.
- Khách trả toàn bộ tiền. Giữ chỗ 10 phút, hết hạn chưa trả thì mở lại các ô.
- Màu trắng: trống; xanh: booked; cam: locked/chờ thanh toán; tím: đang chọn; xám: không phục vụ. Có chữ đi kèm.
- Hủy từ 24 giờ trước giờ chơi: hoàn 100%; dưới 24 giờ và trước giờ chơi: hoàn 50%. Tính theo thời điểm khách gửi yêu cầu.
- Đến trễ/không đến không hoàn tiền. Chủ sân chuyển tiền hoàn trực tiếp trong 48 giờ.
- Đổi lịch trả 30.000đ + max(0, giá mới - giá cũ); không hoàn chênh lệch nếu giá mới thấp hơn.
- Giữ lịch cũ cho đến khi đổi thành công.
- Đơn nhận Zalo/tại quầy được chủ sân nhập và đánh dấu booked; chủ sân tự kiểm tra tiền mặt/chuyển khoản.
- Quản lý chịu trách nhiệm giải quyết xung đột do đơn bên ngoài không được cập nhật.
- Kết nối MB Bank sẽ làm sau. Prototype không xác nhận tiền thật.

## Cách lưu và xử lý dự kiến

- Một đơn gồm danh sách ô, không dùng khoảng từ giờ đầu đến giờ cuối để chiếm cả các ô ở giữa.
- Prototype dự kiến một đơn thuộc một sân và một ngày. Chọn ngày/sân khác thì tạo đơn khác.
- Giờ hiển thị theo Việt Nam (UTC+7), thời điểm lưu dưới dạng Date.
- Giá trong bản đầu gồm giá thường và giá từ mốc cao điểm. Bảng giá cuối tuần, ngày lễ và nhiều khoảng giá chưa triển khai.
- Lưu tên/số điện thoại từ lúc tạo đơn chờ thanh toán. Trang xác nhận cho khách kiểm tra lại.
- Link quản lý đơn cho khách cần token khó đoán; chỉ lưu hash token trong database. Không cấp quyền hủy bằng số điện thoại đơn thuần.
- SlotLock có unique index `(courtId, slotStart)`. API tạo đơn cần transaction để chiếm toàn bộ ô hoặc không chiếm ô nào.
- Đọc lịch bỏ qua lock hết hạn ngay. Khi ghi đơn cần giải phóng lock cũ và cập nhật đơn hết hạn trong transaction; không chỉ dựa vào bộ dọn dẹp.
- Giao dịch cần đối chiếu số tiền, tài khoản, mã đơn và tránh ghi nhận một giao dịch hai lần.

## Còn cần xác định trước khi hoàn thiện

- Mốc bắt đầu tính hạn hoàn tiền 48 giờ.
- Chính sách nếu chủ sân hủy do sự cố.
- Với đơn rời nhau, hủy/đổi toàn bộ hay cho từng ô; cách tính mốc 24 giờ. Bộ quy tắc đang tính theo ô đầu tiên để làm bản đầu, chưa coi là chính sách đã xác nhận.
- Thời điểm ghi nhận không đến. Hiểu tạm là không tự bán lại giờ đã booked dù sân trống vì khách không đến.
- Điều kiện đổi sát giờ và cách xác nhận thu phí đổi.
- Nhà cung cấp kết nối tài khoản MB và thông tin nhận hoàn tiền.

## Tình trạng code

Đã có giao diện xem sân/giờ và báo giá, API đọc, schema và các hàm tính phí. Chưa có tạo đơn thật, transaction giữ chỗ, xác thực chủ sân, quản lý sân/đơn, thanh toán, hủy/đổi/check-in hoặc báo cáo. Cấu trúc index mới được khai báo, chưa chứng minh chống trùng bằng kiểm thử database thật.
