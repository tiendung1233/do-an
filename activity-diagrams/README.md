# BIỂU ĐỒ HOẠT ĐỘNG (ACTIVITY DIAGRAMS) - HỆ THỐNG SmartCash SHOPPING

Thư mục này chứa tất cả các biểu đồ hoạt động (Activity Diagram) cho hệ thống SmartCash Shopping.

## Danh Sách Các Biểu Đồ

### 1. Đăng Ký Tài Khoản
**File:** `01-dang-ky-tai-khoan.puml`
- Activity diagram cho chức năng đăng ký tài khoản
- Bao gồm: nhập thông tin, kiểm tra email, hash password, gửi email xác thực

### 2. Đăng Nhập
**File:** `02-dang-nhap.puml`
- Activity diagram cho chức năng đăng nhập
- Bao gồm: đăng nhập email/password và Google OAuth

### 3. Xác Thực Tài Khoản
**File:** `03-xac-thuc-tai-khoan.puml`
- Activity diagram cho chức năng xác thực tài khoản
- Click link trong email, xác thực token, cập nhật trạng thái

### 4. Thêm Vào Giỏ Hàng
**File:** `04-them-vao-gio-hang.puml`
- Activity diagram cho chức năng thêm vào giỏ hàng
- Kiểm tra đăng nhập, tồn kho, thêm/cập nhật giỏ hàng

### 5. Tìm Kiếm Sản Phẩm
**File:** `05-tim-kiem-san-pham.puml`
- Activity diagram cho chức năng tìm kiếm sản phẩm
- Tìm theo từ khóa, bộ lọc, sắp xếp

### 6. Chuyển Đổi Link Affiliate
**File:** `06-chuyen-doi-link-affiliate.puml`
- Activity diagram cho chức năng chuyển đổi link
- Phân tích URL, tạo/lấy link affiliate, gắn tracking

### 7. Quên Mật Khẩu
**File:** `07-quen-mat-khau.puml`
- Activity diagram cho chức năng quên mật khẩu
- Yêu cầu reset, gửi email, xác thực token, đặt lại mật khẩu

### 8. Xem Và Chỉnh Sửa Hồ Sơ
**File:** `08-xem-va-chinh-sua-ho-so.puml`
- Activity diagram cho chức năng quản lý hồ sơ
- Xem, chỉnh sửa thông tin, email, SĐT, ảnh, ngân hàng

### 9. Nhắn Tin
**File:** `09-nhan-tin.puml`
- Activity diagram cho chức năng nhắn tin
- Gửi/nhận tin nhắn giữa user và admin

### 10. Gửi Yêu Cầu Hoàn Tiền
**File:** `10-gui-yeu-cau-hoan-tien.puml`
- Activity diagram cho chức năng gửi yêu cầu hoàn tiền
- Xem lịch sử, chọn đơn hàng, gửi yêu cầu

### 11. Duyệt Yêu Cầu Rút Tiền
**File:** `11-duyet-yeu-cau-rut-tien.puml`
- Activity diagram cho admin duyệt rút tiền
- Xem danh sách, duyệt/từ chối, chuyển khoản

### 12. Xem Lịch Sử Rút Tiền
**File:** `12-xem-lich-su-rut-tien.puml`
- Activity diagram cho xem lịch sử rút tiền
- Xem lịch sử, chi tiết, lọc

### 13. Hệ Thống Hạng Thành Viên
**File:** `13-he-thong-hang-thanh-vien.puml`
- Activity diagram cho hệ thống hạng thành viên
- Xem hạng, tự động nâng hạng, áp dụng bonus

### 14. Điểm Danh Hàng Ngày
**File:** `14-diem-danh-hang-ngay.puml`
- Activity diagram cho điểm danh hàng ngày
- Điểm danh, nhận voucher

### 15. Vòng Quay May Mắn
**File:** `15-vong-quay-may-man.puml`
- Activity diagram cho vòng quay may mắn
- Xem lượt quay, quay, nhận phần thưởng

### 16. Trò Chơi Vườn Cây
**File:** `16-tro-choi-vuon-cay.puml`
- Activity diagram cho trò chơi vườn cây
- Trồng, tưới, thu hoạch

### 17. Hệ Thống Giới Thiệu
**File:** `17-he-thong-gioi-thieu.puml`
- Activity diagram cho hệ thống giới thiệu
- Xem mã, đăng ký bằng mã, nhận thưởng

### 18. Bảng Xếp Hạng
**File:** `18-bang-xep-hang.puml`
- Activity diagram cho bảng xếp hạng
- Xem bảng xếp hạng, tra thưởng top 3

### 19. Voucher Cashback
**File:** `19-voucher-cashback.puml`
- Activity diagram cho voucher cashback
- Xem voucher, áp dụng voucher, tạo voucher

### 20. Duyệt Đơn Hàng
**File:** `20-duyet-don-hang.puml`
- Activity diagram cho admin duyệt đơn hàng
- Duyệt/hủy, tính cashback, nâng hạng, tạo lượt quay

### 21. Quản Lý Người Dùng
**File:** `21-quan-ly-nguoi-dung.puml`
- Activity diagram cho admin quản lý người dùng
- Tìm kiếm, xem chi tiết, chỉnh sửa, phân quyền, khóa/mở khóa

### 22. Quản Lý Sản Phẩm
**File:** `22-quan-ly-san-pham.puml`
- Activity diagram cho admin quản lý sản phẩm
- Thêm/sửa/xóa, đồng bộ từ API

### 23. Thống Kê Và Báo Cáo
**File:** `23-thong-ke-va-bao-cao.puml`
- Activity diagram cho thống kê và báo cáo
- Dashboard, thống kê chi tiết, xuất báo cáo

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

- Tất cả các biểu đồ đều là **Activity Diagram** (biểu đồ hoạt động)
- Sử dụng swimlanes để phân chia các actor/component
- Sử dụng đường thẳng (linetype ortho)
- Có đầy đủ các điều kiện (if/else) và luồng xử lý

## Cấu Trúc Thư Mục

```
activity-diagrams/
├── README.md
├── 01-dang-ky-tai-khoan.puml
├── 02-dang-nhap.puml
├── 03-xac-thuc-tai-khoan.puml
├── 04-them-vao-gio-hang.puml
├── 05-tim-kiem-san-pham.puml
├── 06-chuyen-doi-link-affiliate.puml
├── 07-quen-mat-khau.puml
├── 08-xem-va-chinh-sua-ho-so.puml
├── 09-nhan-tin.puml
├── 10-gui-yeu-cau-hoan-tien.puml
├── 11-duyet-yeu-cau-rut-tien.puml
├── 12-xem-lich-su-rut-tien.puml
├── 13-he-thong-hang-thanh-vien.puml
├── 14-diem-danh-hang-ngay.puml
├── 15-vong-quay-may-man.puml
├── 16-tro-choi-vuon-cay.puml
├── 17-he-thong-gioi-thieu.puml
├── 18-bang-xep-hang.puml
├── 19-voucher-cashback.puml
├── 20-duyet-don-hang.puml
├── 21-quan-ly-nguoi-dung.puml
├── 22-quan-ly-san-pham.puml
└── 23-thong-ke-va-bao-cao.puml
```

## Tác Giả

Được tạo cho đồ án hệ thống SmartCash Shopping - Cashback Platform

