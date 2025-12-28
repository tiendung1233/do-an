# BIỂU ĐỒ USE CASE - HỆ THỐNG SmartCash SHOPPING

Thư mục này chứa tất cả các biểu đồ **Use Case Diagram** (không phải Sequence Diagram) cho hệ thống SmartCash Shopping.

## Đặc điểm

- Tất cả các biểu đồ đều là **Use Case Diagram** với actors và use cases
- Sử dụng hình **hộp (rectangle)** thay vì ellipse
- Đường nối là **đường thẳng (orthogonal)**, không có đường cong
- Không có ký tự `\n` trong text để tránh lỗi tiếng Việt

## Danh Sách Các Biểu Đồ

### 1. Use Case Tổng Quát
**File:** `01-use-case-tong-quat.puml`
- Mô tả tổng quan tất cả các use case trong hệ thống
- Các actors: Khách vãng lai, Người dùng, Admin, Hệ thống Affiliate, Hệ thống Thanh toán, Hệ thống Email/OTP

### 2. Thêm Giỏ Hàng
**File:** `02-them-gio-hang.puml`
- Use case diagram cho chức năng giỏ hàng
- Bao gồm: xem chi tiết sản phẩm, thêm vào giỏ, xem giỏ, cập nhật, xóa

### 3. Quản Lý Thông Tin
**File:** `03-quan-ly-thong-tin.puml`
- Use case diagram cho quản lý thông tin cá nhân
- Bao gồm: xem thông tin, chỉnh sửa, quản lý ngân hàng, xem hạng thành viên

### 4. Quản Lý Người Dùng (Admin)
**File:** `04-quan-ly-nguoi-dung.puml`
- Use case diagram cho admin quản lý người dùng
- Bao gồm: xem danh sách, tìm kiếm, chỉnh sửa, phân quyền, khóa/mở khóa

### 5. Quản Lý Sản Phẩm (Admin)
**File:** `05-quan-ly-san-pham.puml`
- Use case diagram cho admin quản lý sản phẩm và cửa hàng
- Bao gồm: thêm/sửa/xóa sản phẩm, quản lý cửa hàng, đồng bộ từ API

### 6. Tìm Kiếm Sản Phẩm và Cửa Hàng
**File:** `06-tim-kiem-san-pham-cua-hang.puml`
- Use case diagram cho chức năng tìm kiếm
- Bao gồm: tìm theo từ khóa, lọc sản phẩm, sắp xếp kết quả

### 7. Nhắn Tin / Chat Hỗ Trợ
**File:** `07-nhan-tin.puml`
- Use case diagram cho chức năng chat
- Bao gồm: gửi/nhận tin nhắn, xem hội thoại (cho cả User và Admin)

### 8. Chuyển Đổi Link Affiliate
**File:** `08-chuyen-doi-link-affiliate.puml`
- Use case diagram cho chức năng chuyển đổi link
- Bao gồm: nhập link, phân tích URL, tạo/lấy link affiliate

### 9. Duyệt Yêu Cầu Rút Tiền (Admin)
**File:** `09-duyet-yeu-cau-rut-tien.puml`
- Use case diagram cho admin duyệt rút tiền
- Bao gồm: xem danh sách, xem chi tiết, duyệt/từ chối, chuyển khoản

### 10. Gửi Yêu Cầu Hoàn Tiền
**File:** `10-gui-yeu-cau-hoan-tien.puml`
- Use case diagram cho gửi yêu cầu hoàn tiền
- Bao gồm: xem lịch sử mua hàng, gửi yêu cầu, nhận webhook từ Affiliate

### 11. Quên Mật Khẩu
**File:** `11-quen-mat-khau.puml`
- Use case diagram cho chức năng quên mật khẩu
- Bao gồm: yêu cầu reset, gửi email, xác thực token, đặt lại mật khẩu

### 12. Xem Và Chỉnh Sửa Hồ Sơ
**File:** `12-xem-va-chinh-sua-ho-so.puml`
- Use case diagram cho quản lý hồ sơ
- Bao gồm: xem hồ sơ, chỉnh sửa thông tin, upload ảnh, quản lý ngân hàng

### 13. Hệ Thống Hạng Thành Viên
**File:** `13-he-thong-hang-thanh-vien.puml`
- Use case diagram cho hệ thống hạng thành viên
- Bao gồm: xem hạng, tự động nâng hạng, áp dụng bonus cashback

### 14. Điểm Danh Hàng Ngày
**File:** `14-diem-danh-hang-ngay.puml`
- Use case diagram cho điểm danh hàng ngày
- Bao gồm: xem trạng thái, điểm danh, nhận voucher, xem lịch sử

### 15. Vòng Quay May Mắn
**File:** `15-vong-quay-may-man.puml`
- Use case diagram cho vòng quay may mắn
- Bao gồm: xem lượt quay, quay vòng quay, nhận phần thưởng, xem lịch sử

### 16. Trò Chơi Vườn Cây
**File:** `16-tro-choi-vuon-cay.puml`
- Use case diagram cho trò chơi vườn cây
- Bao gồm: xem vườn, trồng cây, tưới cây, thu hoạch

### 17. Hệ Thống Giới Thiệu Bạn Bè
**File:** `17-he-thong-gioi-thieu.puml`
- Use case diagram cho hệ thống giới thiệu
- Bao gồm: xem mã giới thiệu, đăng ký bằng mã, nhận thưởng

### 18. Bảng Xếp Hạng
**File:** `18-bang-xep-hang.puml`
- Use case diagram cho bảng xếp hạng
- Bao gồm: xem bảng xếp hạng, xem thứ hạng, tra thưởng top 3

### 19. Voucher Cashback
**File:** `19-voucher-cashback.puml`
- Use case diagram cho hệ thống voucher
- Bao gồm: xem voucher, áp dụng voucher, tạo voucher từ nhiều nguồn

### 20. Thống Kê Và Báo Cáo (Admin)
**File:** `20-thong-ke-va-bao-cao.puml`
- Use case diagram cho hệ thống thống kê
- Bao gồm: dashboard, thống kê doanh thu, người dùng, đơn hàng, xuất báo cáo

### 21. Duyệt Đơn Hàng (Admin)
**File:** `21-duyet-don-hang.puml`
- Use case diagram cho admin duyệt đơn hàng
- Bao gồm: xem danh sách, duyệt/hủy, tính cashback, nâng hạng, tạo lượt quay

## Cách Sử Dụng

### Xem Biểu Đồ Online
1. Truy cập: https://www.plantuml.com/plantuml/uml/
2. Copy nội dung file `.puml` vào editor
3. Biểu đồ sẽ được render tự động

### Sử Dụng VS Code
1. Cài đặt extension "PlantUML" trong VS Code
2. Mở file `.puml`
3. Nhấn `Alt + D` để preview biểu đồ

### Xuất Ra Hình Ảnh
1. Sử dụng PlantUML command line:
   ```bash
   java -jar plantuml.jar file.puml
   ```
2. Hoặc sử dụng online tool: https://www.plantuml.com/plantuml/uml/

## Lưu Ý

- Tất cả các biểu đồ đều là **Use Case Diagram** (không phải Sequence Diagram)
- Sử dụng hình **hộp (rectangle)** với góc vuông (roundcorner 0)
- Đường nối là **đường thẳng (linetype ortho)**
- Không có ký tự `\n` trong text
- Có đầy đủ actors, use cases, và quan hệ (include, extend)

## Cấu Trúc Thư Mục

```
use-case-diagrams/
├── README.md
├── 01-use-case-tong-quat.puml
├── 02-them-gio-hang.puml
├── 03-quan-ly-thong-tin.puml
├── 04-quan-ly-nguoi-dung.puml
├── 05-quan-ly-san-pham.puml
├── 06-tim-kiem-san-pham-cua-hang.puml
├── 07-nhan-tin.puml
├── 08-chuyen-doi-link-affiliate.puml
├── 09-duyet-yeu-cau-rut-tien.puml
├── 10-gui-yeu-cau-hoan-tien.puml
├── 11-quen-mat-khau.puml
├── 12-xem-va-chinh-sua-ho-so.puml
├── 13-he-thong-hang-thanh-vien.puml
├── 14-diem-danh-hang-ngay.puml
├── 15-vong-quay-may-man.puml
├── 16-tro-choi-vuon-cay.puml
├── 17-he-thong-gioi-thieu.puml
├── 18-bang-xep-hang.puml
├── 19-voucher-cashback.puml
├── 20-thong-ke-va-bao-cao.puml
└── 21-duyet-don-hang.puml
```

## Tác Giả

Được tạo cho đồ án hệ thống SmartCash Shopping - Cashback Platform

