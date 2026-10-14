# Làm việc chung

## Bắt đầu

Chủ repo mời người tham gia trong Settings → Collaborators → Add people. Mỗi người chấp nhận lời mời trước khi push nhánh của mình.

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

Mở Pull Request từ nhánh task vào `main`, ghi cách kiểm tra và phần còn thiếu. Nhóm trưởng review rồi merge. Trước task tiếp theo, cập nhật `main` và tạo nhánh mới.

Không sửa tên trường, trạng thái đơn hoặc định dạng API mà chưa thống nhất với nhóm. Dữ liệu mẫu phải ghi rõ là giả; thông tin khảo sát phải có nguồn.

## Bật bảo vệ main bằng GitHub

Workflow `Verify` được khai báo trong repo. Sau khi nó chạy thành công trên GitHub:

1. Settings → Rules → Rulesets → New branch ruleset; đặt tên `Protect main`.
2. Chọn trạng thái Active. Trong Target branches, chọn Include default branch hoặc Include by pattern và nhập `main`.
3. Bật Require a pull request before merging; đặt tối thiểu 1 approval.
4. Bật Require status checks to pass; Add checks và chọn check `Code and tests` do workflow Verify tạo. Bật Require branches to be up to date before merging.
5. Bật Block force pushes và Restrict deletions.
6. Nên bật Require review from Code Owners; nhóm trưởng đã được khai báo trong CODEOWNERS. Bật Dismiss stale pull request approvals when new commits are pushed để code sửa tiếp phải được review lại.
7. Bật Require conversation resolution before merging. Giữ danh sách bypass trống khi thiết lập cho nhóm, rồi bấm Create/Save.

Nhóm trưởng mở PR của mình vẫn cần một thành viên khác review nếu bật 1 approval. CODEOWNERS không tự bật bảo vệ nhánh. Việc có file workflow cũng không tự chặn merge nếu Ruleset chưa được bật.

Thiết lập thành viên, Ruleset và triển khai thuộc GitHub/nhà cung cấp; chưa được thay đổi tự động bởi bộ code này.

## Kiểm tra Ruleset đã hoạt động

Trong một nhánh thử, tạo Pull Request có một lỗi JavaScript rõ ràng. Check phải đỏ và merge phải bị chặn. Đóng PR thử và xóa nhánh sau khi kiểm tra; không ghép thay đổi thử vào main. Với PR hợp lệ, check xanh nhưng chưa có approval thì merge vẫn phải bị chặn.

## Kiểm tra trước khi nhóm trưởng merge

- Check xanh và không còn xung đột với main.
- Đọc diff để biết những file nào bị sửa; phần thay đổi đúng task.
- Kiểm tra thao tác đúng tiêu chí đạt, trên điện thoại nếu đổi UI.
- Với chức năng nghiệp vụ mới, có kiểm thử tương ứng. Hiện CI chưa kiểm thử MongoDB thật hoặc ngân hàng thật; không suy ra những phần đó đúng từ check xanh.
- Mỗi PR giải quyết một task vừa đủ nhỏ để review. Không sửa test hoặc giảm điều kiện kiểm tra chỉ để làm check xanh.

CI bắt được lỗi trong các kiểm tra đã viết. Lỗi nghiệp vụ mới cần bổ sung test và review, không có thiết lập đảm bảo tự động phát hiện mọi lỗi.
