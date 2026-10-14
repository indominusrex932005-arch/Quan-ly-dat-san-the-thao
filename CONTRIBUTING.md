# Làm việc chung

## Bắt đầu

Chủ repo mời người tham gia trong Settings → Collaborators → Add people. Mỗi người chấp nhận lời mời trước khi push nhánh.

Cài Node.js 24, sau đó chạy:

```sh
git clone https://github.com/indominusrex932005-arch/Quan-ly-dat-san-the-thao.git
cd Quan-ly-dat-san-the-thao
npm ci
git switch -c feat/ten-task
npm run dev
```

## Bàn giao một task

```sh
npm run check
npm test
git add duong-dan-file-da-sua
git commit -m "feat: mo ta thay doi"
git push -u origin feat/ten-task
```

Mở PR từ nhánh task vào `main`, ghi cách kiểm tra và phần còn thiếu. Nhóm trưởng xem diff, kiểm tra rồi approve/merge. Mỗi PR nên có một mục tiêu nhỏ, khoảng một hoặc hai màn hình nếu làm UI.

Trước task tiếp theo, commit hoặc stash các thay đổi đang làm rồi cập nhật:

```sh
git switch main
git pull --ff-only origin main
git switch -c feat/ten-task-tiep-theo
```

Không sửa tên trường, trạng thái hoặc API mà chưa thống nhất. Dữ liệu mẫu ghi rõ là giả; thông tin khảo sát có nguồn. UI giữ hợp đồng API, không tự xác nhận thanh toán hay tự quyết định ô đã booked.

## Bảo vệ main bằng GitHub

Đây là cấu hình được lựa chọn cho cách làm hiện tại; tài liệu không tự sửa thiết lập GitHub. Workflow `Verify` có check `Code and tests`. Trong Settings → Rules → Rulesets, tạo/sửa `Protect main`:

1. Enforcement **Active**; Target chọn default branch hiện là `main` hoặc pattern `main`.
2. Bật **Require a pull request before merging**, đặt **Required approvals = 0**.
3. Giữ **Require review from Code Owners**. `.github/CODEOWNERS` hiện chỉ định chủ repo cho mọi file: PR của thành viên cần chủ repo duyệt; PR do chính Code Owner tạo đáp ứng điều kiện sở hữu đó mà không cần người khác duyệt.
4. Bật **Dismiss stale pull request approvals when new commits are pushed**, để thay đổi mới cần được xem lại. Giữ **Require approval of the most recent reviewable push** tắt.
5. Bật **Require status checks to pass**, thêm **Code and tests** nguồn GitHub Actions. Bật **Require branches to be up to date before merging**.
6. Bật **Block force pushes**, **Restrict deletions**, **Require conversation resolution before merging**. Giữ danh sách bypass trống và lưu.

Số approvals bằng 0 không bỏ yêu cầu Code Owners đang bật. Cả PR của chủ repo và thành viên vẫn cần check bắt buộc xanh. Nếu đổi CODEOWNERS, cần kiểm tra lại người đủ điều kiện duyệt. Có file workflow/CODEOWNERS không tự bật bảo vệ nhánh; phải lưu Ruleset trên GitHub.

## Kiểm tra Ruleset đã hoạt động

Trên PR hợp lệ, kiểm tra `Code and tests` xuất hiện là bắt buộc. PR của thành viên chưa được Code Owner duyệt phải bị chặn; PR của chủ repo không nên bị chặn chỉ vì thiếu người khác approve. Nếu còn chặn, xem lý do GitHub hiển thị và kiểm tra các quy tắc đang áp dụng.

Nếu muốn thử CI chặn lỗi, dùng nhánh riêng có một lỗi JavaScript rõ ràng; check phải đỏ và merge bị chặn. Đóng PR, xóa nhánh thử sau kiểm tra; không merge lỗi thử vào main.

## Chia file khi làm UI

- Nhóm trưởng giữ header/footer, thiết kế chung, route và hợp đồng API.
- Người nhận task sửa các màn hình được giao; CSS/JS phần riêng nằm trong file hoặc vùng có phạm vi rõ ràng.
- Không cùng sửa thành phần dùng chung khi chưa thống nhất.
- API chưa có: dùng dữ liệu mẫu có nhãn, liệt kê trạng thái/đầu vào cần nối thật; không báo đã triển khai nghiệp vụ.
- Màn hình thanh toán không tự đặt trạng thái “đã trả tiền”. Bản thật phải lấy kết quả do backend xác minh.

## Trước khi merge

- Check xanh, không xung đột main; diff đúng phạm vi task.
- Kiểm tra thao tác theo tiêu chí đạt và trên điện thoại khi đổi UI.
- Nghiệp vụ mới có kiểm thử phù hợp. CI hiện chưa kiểm chứng MongoDB thật/ngân hàng thật.
- Không sửa test hoặc giảm điều kiện chỉ để check xanh.

CI phát hiện lỗi trong những kiểm tra đã viết; không có thiết lập tự tìm mọi lỗi nghiệp vụ.
