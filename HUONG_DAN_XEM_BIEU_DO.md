# HƯỚNG DẪN XEM BIỂU ĐỒ USE CASE

## CÁCH XEM BIỂU ĐỒ MERMAID

### 1. Xem trên GitHub/GitLab
- Upload file `BIEU_DO_USE_CASE.md` lên GitHub/GitLab
- File sẽ tự động render các biểu đồ Mermaid

### 2. Xem trong VS Code
1. Cài đặt extension: **"Markdown Preview Mermaid Support"**
2. Mở file `BIEU_DO_USE_CASE.md`
3. Nhấn `Ctrl+Shift+V` (Windows/Linux) hoặc `Cmd+Shift+V` (Mac) để xem preview

### 3. Xem online
1. Truy cập: https://mermaid.live
2. Copy code Mermaid từ file `BIEU_DO_USE_CASE.md`
3. Paste vào editor và xem kết quả

### 4. Export sang hình ảnh
- Trên https://mermaid.live, bạn có thể export sang PNG/SVG
- Hoặc sử dụng công cụ: https://mermaid-js.github.io/mermaid-live-editor/

## CẤU TRÚC BIỂU ĐỒ

File `BIEU_DO_USE_CASE.md` bao gồm:

1. **Biểu đồ Use Case tổng quát** - Tổng quan tất cả use case
2. **Biểu đồ Use Case chi tiết - Khách hàng** - Các use case dành cho khách hàng
3. **Biểu đồ Use Case chi tiết - Quản trị viên** - Các use case dành cho admin
4. **Sequence Diagram** - Luồng xử lý chi tiết cho từng use case:
   - Thêm giỏ hàng
   - Nhắn tin
   - Chuyển đổi link affiliate
   - Duyệt yêu cầu rút tiền
   - Gửi yêu cầu hoàn tiền
   - Quên mật khẩu
5. **Mô tả chi tiết** - Mô tả đầy đủ các use case

## CÁC USE CASE CHÍNH

### Khách hàng:
- Đăng ký/Đăng nhập
- Quản lý hồ sơ
- Tìm kiếm sản phẩm và cửa hàng
- Thêm giỏ hàng
- Mua hàng qua link affiliate
- Chuyển đổi link sản phẩm sang link affiliate
- Yêu cầu hoàn tiền
- Yêu cầu rút tiền
- Nhắn tin với admin
- Quên mật khẩu

### Quản trị viên:
- Quản lý người dùng
- Quản lý sản phẩm
- Duyệt đơn hàng
- Duyệt yêu cầu rút tiền
- Chat hỗ trợ
- Thống kê và báo cáo

