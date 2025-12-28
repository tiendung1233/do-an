# SƠ ĐỒ CƠ SỞ DỮ LIỆU - HỆ THỐNG SmartCash SHOPPING

Thư mục này chứa sơ đồ cơ sở dữ liệu (Database Diagram / ERD) cho hệ thống SmartCash Shopping.

## File

### 1. Sơ Đồ Cơ Sở Dữ Liệu Tổng Quan

**File:** `01-so-do-co-so-du-lieu.puml`

- ERD đầy đủ cho toàn bộ hệ thống
- Bao gồm tất cả các bảng và quan hệ giữa chúng

## Các Nhóm Bảng Chính

### 1. Quản Lý Người Dùng

- **users**: Thông tin người dùng, hạng thành viên, số tiền, mã giới thiệu
- **bank_info**: Thông tin ngân hàng của người dùng
- **password_reset**: Token reset mật khẩu
- **password_reset_history**: Lịch sử reset mật khẩu

### 2. Sản Phẩm và Cửa Hàng

- **shops**: Thông tin cửa hàng
- **products**: Thông tin sản phẩm, link affiliate, tỷ lệ hoàn tiền

### 3. Giỏ Hàng và Đơn Hàng

- **cart**: Giỏ hàng của người dùng
- **purchase_history**: Lịch sử mua hàng, cashback, voucher

### 4. Rút Tiền

- **withdraw_request**: Yêu cầu rút tiền
- **withdraw_history**: Lịch sử rút tiền

### 5. Voucher

- **vouchers**: Voucher cashback (từ điểm danh, nâng hạng, vòng quay, admin)

### 6. Hệ Thống Hạng Thành Viên

- **membership_history**: Lịch sử thay đổi hạng thành viên

### 7. Điểm Danh Hàng Ngày

- **daily_checkin**: Lịch điểm danh tuần, streak

### 8. Vòng Quay May Mắn

- **spin_wheel**: Số lượt quay của người dùng
- **spin_history**: Lịch sử quay và phần thưởng

### 9. Trò Chơi Vườn Cây

- **tree**: Thông tin cây của người dùng
- **harvest_history**: Lịch sử thu hoạch

### 10. Hệ Thống Giới Thiệu

- **referral_reward**: Phần thưởng giới thiệu
- **referral_history**: Lịch sử thưởng giới thiệu

### 11. Bảng Xếp Hạng

- **leaderboard_reward**: Phần thưởng top 3

### 12. Chat/Nhắn Tin

- **conversations**: Hội thoại giữa user và admin
- **messages**: Tin nhắn trong hội thoại

## Quan Hệ Chính

1. **users** là bảng trung tâm, có quan hệ với hầu hết các bảng khác
2. **purchase_history** liên kết với nhiều bảng: users, products, shops, vouchers
3. **users** có quan hệ tự tham chiếu qua `referredBy` (hệ thống giới thiệu)
4. Các bảng lịch sử (history) đều liên kết với bảng chính tương ứng

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

- Tất cả các bảng đều có `createdAt` và `updatedAt` (timestamps)
- Các trường `*` là bắt buộc (required)
- Các trường có `<<unique>>` là unique constraint
- Các trường có `<<FK>>` là foreign key
- Các trường có `<<PK>>` là primary key
- Các enum được định nghĩa rõ ràng trong comment

## Cấu Trúc Thư Mục

```
database-diagrams/
├── README.md
└── 01-so-do-co-so-du-lieu.puml
```

## Tác Giả

Được tạo cho đồ án hệ thống SmartCash Shopping - Cashback Platform
