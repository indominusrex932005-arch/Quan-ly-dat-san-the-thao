# Quy tắc nghiệp vụ hiện tại – cập nhật 14/10/2026

Đây là lựa chọn thiết kế, không coi là kết quả phỏng vấn chủ sân. Tên file được giữ để liên kết cũ vẫn dùng được. Còn 3 tuần để hoàn thành và nộp final; chi tiết còn mở cần chốt sớm. Giao diện mẫu chỉ phục vụ phát triển.

## Luồng đặt sân đơn giản

1. Khách chọn cơ sở, sân, ngày và các ô 30 phút.
2. Khách nhập tên/SĐT, bấm xác nhận. Trong bản thật, backend kiểm tra giá/lịch, lưu đơn chờ và giữ toàn bộ ô trong transaction, hạn 10 phút.
3. Trang xác nhận hiện khách, sân, địa chỉ, ngày, từng ô và tổng tiền. Khách bấm thanh toán để xem QR đúng đơn/số tiền.
4. Backend xác minh đã nhận đủ tiền rồi chuyển đơn thành **Đã xác nhận**. Không có bước chủ sân duyệt đơn web.
5. Website hiện phiếu đặt sân gồm mã đơn, tên/SĐT, cơ sở/sân/địa chỉ, ngày, từng ô, số tiền và trạng thái. Khách có thể chụp màn hình.
6. Khi khách đến, chủ sân tra mã đơn trong tài khoản quản lý, kiểm tra đơn thuộc cơ sở mình, đã thanh toán và chưa check-in rồi ghi nhận check-in.

Ảnh chụp giúp tìm đơn, không chứng minh tiền đã về. Mã đơn trên ảnh không cấp quyền hủy/đổi. Không cần thêm luồng quét QR check-in để đáp ứng luồng cơ bản. Chủ sân gửi link web cho khách hỏi qua Zalo để khách tự đặt; không cần nhập lại các đơn đó.

## Đã thống nhất

- Nhiều cơ sở, trước mắt cầu lông; có thể mở rộng pickleball.
- Mỗi cơ sở có một tài khoản chủ sân, cơ sở có nhiều sân con. Chủ sân chỉ quản lý cơ sở mình.
- Chủ sân cập nhật tên sân, địa chỉ cơ sở, giờ mở cửa và giá.
- Khách không cần tài khoản; nhập họ tên và số điện thoại.
- Ô lịch 30 phút, thuê tối thiểu một ô; chọn ô rời nhau được.
- Không có quản lý duyệt đơn web; khách trả toàn bộ tiền.
- Giữ chỗ 10 phút; hết hạn chưa trả thì mở lại toàn bộ ô của đơn.
- Màu trắng: trống; xanh: booked; cam: locked/chờ thanh toán; tím: đang chọn; xám: không phục vụ. Có chữ đi kèm.
- Hủy từ 24 giờ trước giờ chơi: hoàn 100%; dưới 24 giờ và trước giờ chơi: hoàn 50%. Tính theo thời điểm khách gửi yêu cầu.
- Đến trễ/không đến không hoàn tiền. Chủ sân chuyển tiền hoàn trực tiếp trong 48 giờ; mốc bắt đầu 48 giờ còn cần chốt.
- Đổi lịch thu 30.000đ + max(0, giá mới - giá cũ), không hoàn chênh lệch nếu giá mới thấp hơn. Giữ lịch cũ cho đến khi đổi thành công.
- Nếu chủ sân vẫn nhận đặt/thu tiền ngoài web, cần **Thêm đơn trực tiếp**: tên/SĐT, sân/ngày/ô, số tiền nhận và phương thức. Chủ sân tự kiểm tra tiền; backend kiểm tra ô còn trống trước khi đánh dấu booked.
- Chủ sân chịu trách nhiệm giải quyết xung đột do đơn bên ngoài không được cập nhật. Gửi link đặt web là cách ưu tiên để giảm nhập tay.
- MB Bank chưa kết nối, nhà cung cấp chưa chốt. Thanh toán tự động là yêu cầu final; cần xử lý phụ thuộc sớm. Mã QR tải lên đơn thuần không xác nhận đã nhận tiền.

## Cách lưu và xử lý dự kiến

- Một đơn gồm danh sách ô; không dùng khoảng từ ô đầu đến ô cuối để chiếm cả ô ở giữa.
- Phương án hiện tại: một đơn thuộc một sân và một ngày; ngày/sân khác tạo đơn khác.
- Hiển thị theo Việt Nam (UTC+7), thời điểm lưu dưới dạng Date.
- Giá hiện có gồm giá thường và giá từ mốc cao điểm. Giá cuối tuần/ngày lễ/nhiều khoảng chưa triển khai.
- Lưu tên/SĐT từ lúc tạo đơn chờ, cho khách kiểm tra lại trên trang xác nhận.
- Khách dùng link token khó đoán để quản lý đơn; chỉ lưu hash token trong database. Không cấp quyền hủy/đổi bằng SĐT hay mã đơn công khai.
- SlotLock có unique index `(courtId, slotStart)`; API thật cần transaction để chiếm toàn bộ ô hoặc không chiếm ô nào.
- Đọc lịch bỏ qua lock hết hạn ngay. Ghi đơn cần giải phóng lock cũ/cập nhật đơn hết hạn trong transaction; không chỉ dựa vào bộ dọn dẹp.
- Tiền nhận phải đối chiếu tài khoản, số tiền, mã đơn; tránh ghi nhận cùng giao dịch hai lần. Không xác nhận theo nút khách bấm.
- Check-in do chủ sân có session hợp lệ thực hiện; backend kiểm tra phạm vi, trạng thái và tránh ghi nhận lần hai.

## Cần xác định trước khi hoàn thiện

- Mốc bắt đầu hạn hoàn tiền 48 giờ, thông tin nhận hoàn tiền.
- Chính sách chủ sân hủy do sự cố.
- Đơn rời nhau: hủy/đổi toàn bộ hay từng ô, mốc 24 giờ tính ra sao. Hàm hiện dùng ô đầu tiên, chưa coi là chính sách đã xác nhận.
- Thời điểm ghi nhận không đến. Hiểu tạm là không bán lại giờ đã booked dù khách không đến, cần xác nhận.
- Điều kiện đổi sát giờ, xác nhận phí đổi và xử lý thanh toán đổi thất bại.
- Nhà cung cấp hỗ trợ nhận giao dịch MB; tiền thiếu, sai mã hoặc về sau khi hết hạn xử lý thế nào.

## Tình trạng code và mẫu giao diện

Đã có đọc sân/lịch, báo giá, schema, hàm tính phí và giao diện chọn giờ/khách. Luồng xem thử `/demo/...` gồm trang thanh toán, phiếu mẫu và bố cục quản lý. Phiên mẫu chỉ ở bộ nhớ: có 10 phút để mở phiếu, dữ liệu được giữ tối đa một giờ hoặc mất khi server khởi động lại; không tạo booking, không giữ ô, không ghi Atlas và không xử lý tiền. Nút **Xem phiếu mẫu** chỉ là mô phỏng giao diện, không xác minh ngân hàng.

Chưa có tạo đơn thật/transaction, xác thực chủ sân, quản lý sân/đơn, thanh toán, hủy/đổi/check-in hoặc báo cáo thật. Khai báo index chưa chứng minh chống trùng bằng kiểm thử database.
