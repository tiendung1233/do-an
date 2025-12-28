# BIỂU ĐỒ TUẦN TỰ (SEQUENCE DIAGRAMS) - HỆ THỐNG SmartCash SHOPPING

Thư mục này chứa tất cả các biểu đồ tuần tự (Sequence Diagram) cho hệ thống SmartCash Shopping.

## Danh Sách Các Biểu Đồ

### 1. Lấy Data Thông Qua API Bên Thứ 3
**File:** `01-lay-data-api-ben-thu-3.puml`
- Hình 2.13. Biểu đồ lấy data thông qua API bên thứ 3
- Đồng bộ sản phẩm từ AccessTrade, MediaMart API

### 2. Tìm Kiếm Cửa Hàng
**File:** `02-tim-kiem-cua-hang.puml`
- Hình 2.14. Biểu đồ chức năng tìm kiếm cửa hàng
- Tìm kiếm, lọc, xem chi tiết cửa hàng

### 3. Xem Thông Tin Sản Phẩm Và Click Mua Hàng
**File:** `03-xem-thong-tin-san-pham-va-mua-hang.puml`
- Hình 2.15. Biểu đồ chức năng xem thông tin sản phẩm và click mua hàng
- Xem chi tiết sản phẩm, lấy link affiliate, chuyển hướng

### 4. Đăng Nhập, Đăng Ký Và Xác Thực Tài Khoản
**File:** `04-dang-nhap-dang-ky-xac-thuc.puml`
- Hình 2.16. Biểu đồ chức năng đăng nhập, đăng ký và xác thực tài khoản
- Đăng ký, đăng nhập (email/password và Google OAuth), xác thực email

### 5. Quên Mật Khẩu
**File:** `05-quen-mat-khau.puml`
- Hình 2.17. Biểu đồ chức năng quên mật khẩu
- Yêu cầu reset, gửi email, xác thực token, đặt lại mật khẩu

### 6. Xem Và Chỉnh Sửa Hồ Sơ Cá Nhân
**File:** `06-xem-va-chinh-sua-ho-so.puml`
- Hình 2.18. Biểu đồ chức năng xem và chỉnh sửa hồ sơ cá nhân
- Xem hồ sơ, cập nhật thông tin, email, SĐT, ảnh đại diện, ngân hàng

### 7. Nhắn Tin Giữa Người Dùng Và Admin
**File:** `07-nhan-tin.puml`
- Hình 2.19. Biểu đồ chức năng nhắn tin giữa người dùng và admin
- Gửi/nhận tin nhắn, WebSocket real-time

### 8. Thêm Vào Giỏ Hàng
**File:** `08-them-vao-gio-hang.puml`
- Hình 2.20. Biểu đồ chức năng thêm vào giỏ hàng
- Kiểm tra đăng nhập, tồn kho, thêm/cập nhật giỏ hàng

### 9. Quản Lý Thông Tin Người Dùng (Admin)
**File:** `09-quan-ly-thong-tin-nguoi-dung.puml`
- Hình 2.21. Biểu đồ chức năng quản lý thông tin người dùng
- Xem danh sách, chi tiết, chỉnh sửa, phân quyền, khóa/mở khóa

### 10. Chuyển Đổi Link Thành Link Affiliate
**File:** `10-chuyen-doi-link-affiliate.puml`
- Hình 2.22. Biểu đồ chức năng chuyển đổi link thành link affiliate sản phẩm
- Phân tích URL, tạo/lấy link affiliate, gắn tracking code

### 11. Duyệt Yêu Cầu Rút Tiền
**File:** `11-duyet-yeu-cau-rut-tien.puml`
- Hình 2.23. Biểu đồ chức năng duyệt yêu cầu rút tiền
- Xem danh sách, duyệt/từ chối, chuyển khoản

### 12. Xem Lịch Sử Rút Tiền
**File:** `12-xem-lich-su-rut-tien.puml`
- Hình 2.24. Biểu đồ chức năng xem lịch sử rút tiền
- Xem lịch sử, chi tiết giao dịch, lọc và tìm kiếm

### 13. Hệ Thống Hạng Thành Viên
**File:** `13-he-thong-hang-thanh-vien.puml`
- Biểu đồ chức năng hệ thống hạng thành viên
- Xem hạng, tự động nâng hạng, áp dụng bonus cashback

### 14. Điểm Danh Hàng Ngày
**File:** `14-diem-danh-hang-ngay.puml`
- Biểu đồ chức năng điểm danh hàng ngày
- Điểm danh, nhận voucher, xem lịch sử

### 15. Vòng Quay May Mắn
**File:** `15-vong-quay-may-man.puml`
- Biểu đồ chức năng vòng quay may mắn
- Xem lượt quay, quay vòng quay, nhận phần thưởng

### 16. Trò Chơi Vườn Cây
**File:** `16-tro-choi-vuon-cay.puml`
- Biểu đồ chức năng trò chơi vườn cây
- Trồng, tưới, thu hoạch cây

### 17. Hệ Thống Giới Thiệu Bạn Bè
**File:** `17-he-thong-gioi-thieu.puml`
- Biểu đồ chức năng hệ thống giới thiệu bạn bè
- Xem mã giới thiệu, đăng ký bằng mã, nhận thưởng

### 18. Bảng Xếp Hạng
**File:** `18-bang-xep-hang.puml`
- Biểu đồ chức năng bảng xếp hạng
- Xem bảng xếp hạng, tự động tra thưởng top 3

### 19. Voucher Cashback
**File:** `19-voucher-cashback.puml`
- Biểu đồ chức năng voucher cashback
- Xem voucher, áp dụng voucher, tạo voucher từ nhiều nguồn

### 20. Thống Kê Và Báo Cáo (Admin)
**File:** `20-thong-ke-va-bao-cao.puml`
- Biểu đồ chức năng thống kê và báo cáo
- Dashboard, thống kê chi tiết, xuất báo cáo

### 21. Duyệt Đơn Hàng (Admin)
**File:** `21-duyet-don-hang.puml`
- Biểu đồ chức năng duyệt đơn hàng
- Duyệt/hủy đơn hàng, tính cashback, nâng hạng, tạo lượt quay

### 22. Gửi Yêu Cầu Hoàn Tiền
**File:** `22-gui-yeu-cau-hoan-tien.puml`
- Biểu đồ chức năng gửi yêu cầu hoàn tiền
- Xem lịch sử, gửi yêu cầu, nhận webhook từ Affiliate

## Cách Sử Dụng

### Xem Biểu Đồ Online
1. Truy cập: https://www.plantuml.com/plantuml/uml/
2. Copy nội dung file `.puml` vào editor
3. Biểu đồ sẽ được render tự động

### Sử Dụng VS Code
1. Cài đặt extension "PlantUML" trong VS Code
2. Mở file `.puml`
3. Nhấn `Alt + D` để preview biểu đồ

## Lưu Ý

- Tất cả các biểu đồ đều là **Sequence Diagram** (biểu đồ tuần tự)
- Sử dụng đường thẳng (linetype ortho)
- Có đầy đủ luồng chính và luồng ngoại lệ
- Các actors và participants được đánh dấu rõ ràng

## Cấu Trúc Thư Mục

```
sequence-diagrams/
├── README.md
├── 01-lay-data-api-ben-thu-3.puml
├── 02-tim-kiem-cua-hang.puml
├── 03-xem-thong-tin-san-pham-va-mua-hang.puml
├── 04-dang-nhap-dang-ky-xac-thuc.puml
├── 05-quen-mat-khau.puml
├── 06-xem-va-chinh-sua-ho-so.puml
├── 07-nhan-tin.puml
├── 08-them-vao-gio-hang.puml
├── 09-quan-ly-thong-tin-nguoi-dung.puml
├── 10-chuyen-doi-link-affiliate.puml
├── 11-duyet-yeu-cau-rut-tien.puml
├── 12-xem-lich-su-rut-tien.puml
├── 13-he-thong-hang-thanh-vien.puml
├── 14-diem-danh-hang-ngay.puml
├── 15-vong-quay-may-man.puml
├── 16-tro-choi-vuon-cay.puml
├── 17-he-thong-gioi-thieu.puml
├── 18-bang-xep-hang.puml
├── 19-voucher-cashback.puml
├── 20-thong-ke-va-bao-cao.puml
├── 21-duyet-don-hang.puml
└── 22-gui-yeu-cau-hoan-tien.puml
```

## Tác Giả

Được tạo cho đồ án hệ thống SmartCash Shopping - Cashback Platform

