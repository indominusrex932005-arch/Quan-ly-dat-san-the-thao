# Làm việc chung

## Bắt đầu

Nhóm trưởng mời 3 thành viên trong Settings → Collaborators → Add people. Mỗi người chấp nhận lời mời trước khi push nhánh của mình.

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
2. Chọn trạng thái Active, nhánh áp dụng là `main`.
3. Bật Require a pull request before merging; đặt tối thiểu 1 approval.
4. Bật Require status checks to pass; chọn check `Code and tests` do workflow Verify tạo.
5. Bật Block force pushes và Restrict deletions.
6. Có thể bật Require review from Code Owners; nhóm trưởng đã được khai báo trong CODEOWNERS.

Nhóm trưởng mở PR của mình vẫn cần một thành viên khác review nếu bật 1 approval. CODEOWNERS không tự bật bảo vệ nhánh. Việc có file workflow cũng không tự chặn merge nếu Ruleset chưa được bật.

Thiết lập thành viên, Ruleset và triển khai thuộc GitHub/nhà cung cấp; chưa được thay đổi tự động bởi bộ code này.
