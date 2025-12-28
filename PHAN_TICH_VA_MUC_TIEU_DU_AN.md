# PHÂN TÍCH VÀ MỤC TIÊU DỰ ÁN SmartCash SHOPPING

## CÁC MỤC TIÊU CHÍNH

### 1. Xây dựng hệ thống quản lý người dùng và sản phẩm toàn diện

Hệ thống cho phép:

- **Quản lý người dùng**: Đăng ký, đăng nhập (email/password và Google OAuth), xác thực tài khoản qua email, đặt lại mật khẩu, quản lý thông tin cá nhân (tên, email, số điện thoại, địa chỉ, thông tin ngân hàng), phân quyền người dùng (khách hàng, nhân viên, admin).
- **Quản lý sản phẩm**: Lưu trữ thông tin chi tiết về sản phẩm (tên, mô tả, giá, hình ảnh, cửa hàng, tỷ lệ hoàn tiền), quản lý danh sách cửa hàng đối tác, tích hợp link affiliate từ các nền tảng (AccessTrade, MediaMart), tự động chuyển đổi link sản phẩm thành link affiliate.

### 2. Phát triển tính năng tìm kiếm và gợi ý sản phẩm thông minh

- **Tìm kiếm nâng cao**: Tìm kiếm sản phẩm theo từ khóa, lọc theo cửa hàng, danh mục, sắp xếp theo giá (tăng/giảm), sắp xếp theo độ bán chạy, sắp xếp theo sản phẩm mới nhất.
- **Trải nghiệm duyệt web**: Hiển thị sản phẩm nổi bật, danh sách cửa hàng với ưu đãi hoàn tiền, phân trang tự động (infinite scroll), giao diện responsive trên mọi thiết bị.

### 3. Triển khai cơ chế hoàn tiền tự động và hệ thống thưởng đa cấp

- **Theo dõi đơn hàng và hoàn tiền**: Tự động theo dõi đơn hàng thông qua link affiliate, tính toán số tiền hoàn tiền dựa trên tỷ lệ hoàn tiền của sản phẩm, quản lý trạng thái đơn hàng (chờ duyệt, đã duyệt, hủy), lưu trữ lịch sử mua hàng chi tiết.
- **Hệ thống thưởng đa cấp**:
  - **Hệ thống hạng thành viên**: Phân loại thành viên theo 4 cấp độ (None, Bronze, Silver, Gold) dựa trên tổng tiền đã chi tiêu, mỗi hạng nhận thêm phần trăm cashback bonus.
  - **Hệ thống voucher**: Người dùng nhận voucher cashback thông qua điểm danh hàng ngày, áp dụng voucher vào đơn hàng đã duyệt để nhận thêm cashback.
  - **Hệ thống giới thiệu**: Mỗi người dùng có mã giới thiệu riêng, nhận thưởng khi người được giới thiệu mua hàng, theo dõi danh sách người đã giới thiệu và số tiền thưởng.
  - **Bảng xếp hạng**: Xếp hạng người dùng theo tổng cashback và số lượng người giới thiệu, trao thưởng cho top 3 hàng tháng, hiển thị bảng xếp hạng mọi thời đại.
- **Rút tiền**: Người dùng có thể yêu cầu rút tiền về tài khoản ngân hàng, admin quản lý và duyệt yêu cầu rút tiền, lưu trữ lịch sử giao dịch rút tiền.

### 4. Xây dựng hệ thống giải trí và tương tác người dùng

- **Vòng quay may mắn (Spin Wheel)**: Người dùng nhận lượt quay miễn phí khi hoàn thành đơn hàng, quay để nhận tiền mặt, voucher, hoặc các phần thưởng khác, theo dõi lịch sử quay.
- **Trò chơi vườn cây (Tree Game)**: Trồng cây, tưới nước để cây phát triển, thu hoạch cây để nhận phần thưởng, theo dõi trạng thái cây và phần thưởng.
- **Điểm danh hàng ngày (Daily Check-in)**: Người dùng điểm danh mỗi ngày để nhận voucher cashback (từ 1% đến 7%), theo dõi lịch sử điểm danh và phần thưởng đã nhận.

### 5. Hệ thống hỗ trợ khách hàng và quản trị

- **Chat hỗ trợ trực tuyến**: Người dùng có thể nhắn tin trực tiếp với admin để được hỗ trợ, admin quản lý và trả lời tin nhắn từ người dùng, lưu trữ lịch sử cuộc trò chuyện.
- **Quản trị viên**: Dashboard tổng quan với thống kê hệ thống, quản lý người dùng (xem, chỉnh sửa, phân quyền), quản lý sản phẩm (thêm, sửa, xóa, cập nhật), quản lý đơn hàng và hoàn tiền, quản lý yêu cầu rút tiền, quản lý dịch vụ cung cấp (shops, affiliate links), phân tích và báo cáo (biểu đồ doanh thu, đơn hàng, người dùng), quản lý chat hỗ trợ.

### 6. Tích hợp và tự động hóa

- **Tích hợp API bên thứ ba**: Tích hợp AccessTrade API để lấy sản phẩm và tạo link affiliate, tích hợp MediaMart API, tích hợp Google OAuth cho đăng nhập nhanh.
- **Tự động hóa**: Cron job tự động cập nhật sản phẩm, tự động tính toán và cập nhật hạng thành viên, tự động trao thưởng cho top leaderboard hàng tháng.

---

## KẾT QUẢ DỰ KIẾN

### Website SmartCash Shopping hoàn thiện: Một website đầy đủ chức năng, đáp ứng các yêu cầu đã đề ra

### Đối với Khách hàng:

#### Quản lý tài khoản và thông tin cá nhân

- Đăng ký, đăng nhập tài khoản (email/password hoặc Google OAuth)
- Xác thực tài khoản qua email
- Đặt lại mật khẩu khi quên
- Xem và chỉnh sửa thông tin cá nhân (tên, email, số điện thoại, địa chỉ)
- Quản lý thông tin ngân hàng để rút tiền
- Xem thẻ thành viên và hạng hiện tại

#### Mua sắm và hoàn tiền

- Tra cứu sản phẩm theo từ khóa, cửa hàng, danh mục
- Xem danh sách cửa hàng đối tác với tỷ lệ hoàn tiền
- Xem chi tiết sản phẩm (giá, mô tả, tỷ lệ hoàn tiền)
- Thêm sản phẩm vào giỏ hàng
- Mua sản phẩm qua link affiliate tự động
- Chuyển đổi link sản phẩm muốn mua thành link affiliate
- Xem lịch sử mua hàng với chi tiết cashback (bao gồm bonus từ hạng và voucher)
- Theo dõi trạng thái đơn hàng (chờ duyệt, đã duyệt, hủy)

#### Quản lý tiền hoàn và rút tiền

- Xem tổng số tiền hoàn đã nhận
- Xem số tiền có thể rút
- Yêu cầu rút tiền về tài khoản ngân hàng
- Xem lịch sử rút tiền và giao dịch

#### Hệ thống thưởng và giải trí

- **Hệ thống hạng thành viên**: Xem hạng hiện tại và lợi ích, theo dõi tiến độ thăng hạng, nhận bonus cashback theo hạng
- **Voucher**: Điểm danh hàng ngày để nhận voucher, xem kho voucher của mình, áp dụng voucher vào đơn hàng đã duyệt
- **Giới thiệu bạn bè**: Xem mã giới thiệu của mình, chia sẻ mã giới thiệu, xem danh sách người đã giới thiệu, nhận thưởng khi người được giới thiệu mua hàng
- **Bảng xếp hạng**: Xem bảng xếp hạng cashback và giới thiệu, xem thứ hạng của mình, nhận thưởng nếu vào top 3
- **Vòng quay may mắn**: Quay vòng quay để nhận phần thưởng, xem lịch sử quay
- **Trò chơi vườn cây**: Trồng cây, tưới nước, thu hoạch để nhận phần thưởng

#### Hỗ trợ và tương tác

- Nhắn tin trực tiếp với admin để được hỗ trợ
- Xem lịch sử chat
- Xem thông tin và hướng dẫn sử dụng

### Đối với Admin:

#### Dashboard và thống kê

- Dashboard tổng quan với các chỉ số quan trọng (tổng người dùng, tổng đơn hàng, tổng doanh thu, tổng cashback đã trả)
- Biểu đồ thống kê doanh thu theo thời gian
- Biểu đồ thống kê đơn hàng theo thời gian
- Biểu đồ thống kê người dùng mới theo thời gian
- Báo cáo chi tiết về hoạt động hệ thống

#### Quản lý người dùng

- Xem danh sách tất cả người dùng
- Xem chi tiết thông tin người dùng
- Chỉnh sửa thông tin người dùng
- Phân quyền người dùng (khách hàng, nhân viên, admin)
- Quản lý tài khoản người dùng (khóa/mở khóa)

#### Quản lý sản phẩm và cửa hàng

- Thêm, sửa, xóa sản phẩm
- Cập nhật thông tin sản phẩm (giá, mô tả, hình ảnh, tỷ lệ hoàn tiền)
- Quản lý danh sách cửa hàng đối tác
- Quản lý link affiliate và thông tin affiliate
- Đồng bộ sản phẩm từ API bên thứ ba (AccessTrade, MediaMart)

#### Quản lý đơn hàng và hoàn tiền

- Xem danh sách tất cả đơn hàng
- Xem chi tiết đơn hàng (sản phẩm, giá, cashback, trạng thái)
- Duyệt hoặc hủy đơn hàng
- Quản lý trạng thái hoàn tiền
- Xem thống kê về đơn hàng và cashback

#### Quản lý yêu cầu rút tiền

- Xem danh sách yêu cầu rút tiền
- Xem chi tiết yêu cầu (người dùng, số tiền, thông tin ngân hàng)
- Duyệt hoặc từ chối yêu cầu rút tiền
- Quản lý thanh toán và giao dịch rút tiền
- Xem lịch sử rút tiền

#### Quản lý chat hỗ trợ

- Xem danh sách cuộc trò chuyện với người dùng
- Trả lời tin nhắn từ người dùng
- Quản lý và theo dõi các yêu cầu hỗ trợ

#### Quản lý hệ thống thưởng

- Quản lý hệ thống hạng thành viên (cấu hình điều kiện và bonus)
- Quản lý voucher (tạo, xóa, cấu hình voucher)
- Quản lý phần thưởng leaderboard (cấu hình phần thưởng top 3)
- Quản lý phần thưởng vòng quay may mắn
- Quản lý phần thưởng trò chơi vườn cây
- Quản lý phần thưởng điểm danh

#### Báo cáo và phân tích

- Tạo báo cáo về doanh thu, đơn hàng, người dùng
- Phân tích xu hướng và hiệu suất hệ thống
- Xuất dữ liệu để phân tích sâu hơn

---

## CÔNG NGHỆ SỬ DỤNG

### Frontend

- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **State Management**: React Hooks, Context API
- **Authentication**: JWT, Cookies

### Backend

- **Framework**: Node.js, Express.js
- **Database**: MongoDB với Mongoose
- **Authentication**: Passport.js, JWT, Google OAuth
- **File Upload**: Multer
- **Email**: Nodemailer
- **Scheduling**: Node-cron
- **API Integration**: AccessTrade API, MediaMart API

### Infrastructure

- **Session Management**: Express-session với MongoDB Store
- **CORS**: Cấu hình CORS cho phép giao tiếp giữa frontend và backend
- **Environment Variables**: dotenv

---

## ĐIỂM NỔI BẬT CỦA HỆ THỐNG

1. **Hệ thống hoàn tiền đa cấp**: Kết hợp cashback cơ bản, bonus từ hạng thành viên, bonus từ voucher, và thưởng giới thiệu
2. **Gamification**: Vòng quay may mắn, trò chơi vườn cây, điểm danh hàng ngày tạo động lực cho người dùng
3. **Tự động hóa cao**: Tự động tính cashback, tự động cập nhật hạng thành viên, tự động trao thưởng
4. **Tích hợp API đa nền tảng**: Tích hợp nhiều nền tảng affiliate để có nhiều sản phẩm và cửa hàng
5. **Quản trị toàn diện**: Admin panel đầy đủ tính năng để quản lý mọi khía cạnh của hệ thống
6. **Trải nghiệm người dùng tốt**: Giao diện hiện đại, responsive, dễ sử dụng
