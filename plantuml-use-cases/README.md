# BIỂU ĐỒ USE CASE - HỆ THỐNG SmartCash SHOPPING

Thư mục này chứa tất cả các biểu đồ Use Case được viết bằng PlantUML cho hệ thống SmartCash Shopping.

## Danh Sách Các Biểu Đồ

### 1. Use Case Tổng Quát

**File:** `01-use-case-tong-quat.puml`

- Mô tả tổng quan tất cả các use case trong hệ thống
- Các actors: Khách vãng lai, Người dùng, Admin, Hệ thống Affiliate, Hệ thống Thanh toán, Hệ thống Email/OTP
- Bao gồm các use case chính và mối quan hệ giữa chúng

### 2. Thêm Giỏ Hàng

**File:** `02-them-gio-hang.puml`

- Sequence diagram chi tiết luồng thêm sản phẩm vào giỏ hàng
- Bao gồm kiểm tra đăng nhập, kiểm tra tồn kho, cập nhật số lượng
- Có xử lý các luồng ngoại lệ

### 3. Quản Lý Thông Tin

**File:** `03-quan-ly-thong-tin.puml`

- Use case diagram cho quản lý thông tin cá nhân
- Bao gồm: xem thông tin, chỉnh sửa thông tin, quản lý ngân hàng, xem hạng thành viên

### 4. Quản Lý Người Dùng (Admin)

**File:** `04-quan-ly-nguoi-dung.puml`

- Use case diagram cho admin quản lý người dùng
- Bao gồm: xem danh sách, tìm kiếm, chỉnh sửa, phân quyền, khóa/mở khóa tài khoản

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

- Sequence diagram chi tiết luồng nhắn tin giữa người dùng và admin
- Bao gồm WebSocket real-time, lưu trữ tin nhắn, thông báo

### 8. Chuyển Đổi Link Affiliate

**File:** `08-chuyen-doi-link-affiliate.puml`

- Sequence diagram chi tiết luồng chuyển đổi link sản phẩm sang link affiliate
- Tích hợp với AccessTrade và MediaMart API
- Có xử lý cache và tracking

### 9. Duyệt Yêu Cầu Rút Tiền (Admin)

**File:** `09-duyet-yeu-cau-rut-tien.puml`

- Sequence diagram chi tiết luồng admin duyệt yêu cầu rút tiền
- Bao gồm kiểm tra số dư, tích hợp hệ thống thanh toán, gửi email thông báo

### 10. Gửi Yêu Cầu Hoàn Tiền

**File:** `10-gui-yeu-cau-hoan-tien.puml`

- Sequence diagram chi tiết luồng gửi yêu cầu hoàn tiền
- Bao gồm cả luồng thủ công và tự động từ webhook Affiliate

### 11. Quên Mật Khẩu

**File:** `11-quen-mat-khau.puml`

- Sequence diagram chi tiết luồng đặt lại mật khẩu
- Bao gồm gửi email reset, xác thực token, cập nhật mật khẩu mới

### 12. Xem Và Chỉnh Sửa Hồ Sơ

**File:** `12-xem-va-chinh-sua-ho-so.puml`

- Sequence diagram chi tiết luồng xem và chỉnh sửa hồ sơ cá nhân
- Bao gồm cập nhật thông tin, email, số điện thoại, ảnh đại diện, thông tin ngân hàng

### 13. Hệ Thống Hạng Thành Viên

**File:** `13-he-thong-hang-thanh-vien.puml`

- Sequence diagram cho hệ thống hạng thành viên (None, Bronze, Silver, Gold)
- Tự động nâng hạng dựa trên tổng tiền chi tiêu, bonus cashback theo hạng

### 14. Điểm Danh Hàng Ngày

**File:** `14-diem-danh-hang-ngay.puml`

- Sequence diagram cho tính năng điểm danh hàng ngày
- Nhận voucher cashback từ 1% đến 7% theo ngày trong tuần

### 15. Vòng Quay May Mắn

**File:** `15-vong-quay-may-man.puml`

- Sequence diagram cho vòng quay may mắn
- Nhận lượt quay từ đơn hàng, quay để nhận phần thưởng (voucher, tiền, điểm)

### 16. Trò Chơi Vườn Cây

**File:** `16-tro-choi-vuon-cay.puml`

- Sequence diagram cho trò chơi vườn cây
- Trồng, tưới, thu hoạch cây để nhận phần thưởng

### 17. Hệ Thống Giới Thiệu Bạn Bè

**File:** `17-he-thong-gioi-thieu.puml`

- Sequence diagram cho hệ thống giới thiệu
- Mã giới thiệu, thưởng khi người được giới thiệu mua hàng

### 18. Bảng Xếp Hạng

**File:** `18-bang-xep-hang.puml`

- Sequence diagram cho bảng xếp hạng
- Xếp hạng theo tổng chi tiêu/cashback, thưởng cho top 3 hàng tháng

### 19. Voucher Cashback

**File:** `19-voucher-cashback.puml`

- Sequence diagram cho hệ thống voucher
- Tạo, quản lý, áp dụng voucher vào đơn hàng

### 20. Thống Kê Và Báo Cáo (Admin)

**File:** `20-thong-ke-va-bao-cao.puml`

- Sequence diagram cho hệ thống thống kê và báo cáo
- Dashboard, thống kê doanh thu, người dùng, đơn hàng, cashback

### 21. Duyệt Đơn Hàng (Admin)

**File:** `21-duyet-don-hang.puml`

- Sequence diagram cho admin duyệt đơn hàng
- Tự động tính cashback, nâng hạng, tạo lượt quay khi duyệt

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

### Sử Dụng Trong Tài Liệu

- Copy code PlantUML vào Markdown với code block:
  ````markdown
  ```plantuml
  @startuml
  ...
  @enduml
  ```
  ````
- Hoặc xuất ra PNG/SVG và chèn vào tài liệu Word/PowerPoint

## Lưu Ý

- Tất cả các biểu đồ đều sử dụng theme `plain` với màu sắc nhất quán
- Sequence diagrams có đầy đủ luồng chính và luồng ngoại lệ
- Use case diagrams có mô tả chi tiết các use case con
- Các actors và hệ thống bên ngoài được đánh dấu rõ ràng

## Cấu Trúc Thư Mục

```
plantuml-use-cases/
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
