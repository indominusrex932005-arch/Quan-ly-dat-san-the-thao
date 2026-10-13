# Hệ thống quản lý đặt sân thể thao – Nhóm 5

Dự án cho môn System và Advanced Web. Nhóm có 4 thành viên. Bản hiện tại là bộ khởi đầu để phát triển chung, chưa phải hệ thống đặt sân hoàn chỉnh.

## Công nghệ

JavaScript, Node.js 24 LTS, Express 5, EJS, Bootstrap 5, MongoDB Atlas và Mongoose. Các thư viện session, bcrypt và Zod đã được chuẩn bị để phát triển tiếp.

## Chạy giao diện mẫu

Cài Node.js 24, sau đó mở terminal trong thư mục dự án:

```sh
npm ci
npm run dev
```

Mở `http://localhost:3000` trên máy đang chạy ứng dụng. Chế độ mẫu mặc định không cần MongoDB, không tạo đơn và không nhận tiền. Nhấn Ctrl+C để dừng.

Hiện có: chọn một trong hai cơ sở mẫu; chọn sân và ngày; xem ô trống/booked/locked; chọn ô 30 phút rời nhau; nhập tên và số điện thoại; xem báo giá do backend tính. Trang đăng nhập chủ sân mới là giao diện, chưa xác thực.

## Kiểm tra trước khi gửi Pull Request

```sh
npm run check
npm test
```

`check` kiểm tra JavaScript và biên dịch template EJS. Bộ test kiểm tra báo giá, ô rời nhau, hết hạn lock khi đọc lịch, chính sách phí/hoàn tiền, đầu vào và API. Chưa có kiểm thử ghi dữ liệu MongoDB, đặt đồng thời hoặc giao dịch ngân hàng thật.

## Kết nối MongoDB khi phát triển tiếp

Sao chép `.env.example` thành `.env`. Dùng database riêng cho phát triển, điền `MONGODB_URI`, `SESSION_SECRET` ít nhất 32 ký tự và đặt `DEMO_MODE=false`. Giá trị cấu hình chỉ nằm ở máy của bạn hoặc phần Environment của máy chủ.

```sh
npm run seed
npm start
```

Seed chỉ thêm/cập nhật 2 cơ sở và 3 sân mẫu theo tên; không xóa toàn bộ database, không tạo tài khoản. Chế độ MongoDB hiện đọc cơ sở, sân và lịch; các API ghi đơn/xác thực sẽ được triển khai tiếp. MongoDB thật chưa được kiểm chứng trong bộ khởi đầu vì chưa có cấu hình kết nối.

## Cấu trúc

```text
src/app.js             Trang EJS và API hiện có
src/server.js          Khởi động ứng dụng
src/config.js          Kiểm tra cấu hình
src/domain/            Quy tắc thời gian, giá, phí và dữ liệu khách
src/models/            Schema Mongoose
src/services/          Đọc dữ liệu mẫu hoặc MongoDB
src/data/              Dữ liệu giả cho UI
views/                 Giao diện EJS
public/                CSS và JavaScript trên trình duyệt
scripts/               Kiểm tra template và nhập dữ liệu mẫu
tests/                 Kiểm thử
docs/                  Tài liệu
.github/               CI và mẫu Pull Request
```

## Tài liệu hiện hành

- [Quy tắc prototype](docs/QUY_TAC_PROTOTYPE.md)
- [API và phần chưa triển khai](docs/API.md)
- [Cách làm nhóm và bật bảo vệ main](CONTRIBUTING.md)
- [Các bước phát triển tiếp](docs/CONG_VIEC_TIEP_THEO.md)

Các file Word và sơ đồ cũ trong `docs/` chưa được sửa theo phương án mới. Chúng vẫn có nội dung về duyệt đơn và phương án nhóm cũ; dùng tài liệu prototype trên làm căn cứ cho code hiện tại.

## Triển khai sau

Ứng dụng Express/EJS chạy chung một máy chủ. Trên Render, lệnh cài là `npm ci`, lệnh chạy là `npm start`; đặt `NODE_ENV=production`, `DEMO_MODE=false` và cấu hình database/session riêng. Chưa triển khai website công khai; chưa tích hợp MB Bank. Hoàn thiện chức năng trước khi dùng với khách và tiền thật.
