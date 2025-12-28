# CÁC MỤC TIÊU CHÍNH VÀ KẾT QUẢ DỰ KIẾN - SmartCash SHOPPING

## CÁC MỤC TIÊU CHÍNH

• **Xây dựng hệ thống quản lý thông tin người dùng và sản phẩm toàn diện**. Hệ thống này sẽ cho phép người dùng tạo tài khoản (đăng ký bằng email/password hoặc Google OAuth), đăng nhập, xác thực tài khoản qua email, đặt lại mật khẩu, quản lý thông tin cá nhân (tên, email, số điện thoại, địa chỉ, thông tin ngân hàng) và theo dõi lịch sử mua hàng. Đối với sản phẩm, hệ thống sẽ lưu trữ thông tin chi tiết về sản phẩm (tên, mô tả, giá, hình ảnh, cửa hàng, tỷ lệ hoàn tiền), quản lý danh sách cửa hàng đối tác, tích hợp link affiliate từ các nền tảng (AccessTrade, MediaMart) và tự động chuyển đổi link sản phẩm thành link affiliate.

• **Phát triển tính năng tìm kiếm và gợi ý sản phẩm thông minh**. Người dùng có thể tìm kiếm sản phẩm theo từ khóa, lọc theo cửa hàng, danh mục, sắp xếp theo giá (tăng/giảm), sắp xếp theo độ bán chạy hoặc sản phẩm mới nhất. Hệ thống sẽ hiển thị sản phẩm nổi bật, danh sách cửa hàng với ưu đãi hoàn tiền và hỗ trợ phân trang tự động (infinite scroll) để tối ưu trải nghiệm duyệt web.

• **Triển khai cơ chế hoàn tiền tự động và hệ thống thưởng đa cấp**. Khi người dùng mua hàng thông qua SmartCash Shopping, hệ thống sẽ tự động theo dõi đơn hàng và tính toán số tiền hoàn tiền tương ứng. Hệ thống bao gồm: (1) Hệ thống hạng thành viên (None, Bronze, Silver, Gold) với bonus cashback theo hạng dựa trên tổng tiền đã chi tiêu; (2) Hệ thống voucher cashback thông qua điểm danh hàng ngày và áp dụng vào đơn hàng; (3) Hệ thống giới thiệu bạn bè với mã giới thiệu riêng và thưởng khi người được giới thiệu mua hàng; (4) Bảng xếp hạng với thưởng cho top 3 hàng tháng; (5) Vòng quay may mắn và trò chơi vườn cây để nhận thêm phần thưởng. Người dùng có thể theo dõi trạng thái hoàn tiền, xem chi tiết cashback (bao gồm bonus từ hạng và voucher) và rút tiền về tài khoản ngân hàng của mình một cách dễ dàng.

• **Xây dựng hệ thống giải trí và tương tác người dùng**. Hệ thống tích hợp các tính năng gamification như vòng quay may mắn (nhận lượt quay khi hoàn thành đơn hàng), trò chơi vườn cây (trồng, tưới, thu hoạch để nhận phần thưởng), và điểm danh hàng ngày (nhận voucher cashback từ 1% đến 7%). Các tính năng này tạo động lực cho người dùng tham gia và sử dụng hệ thống thường xuyên hơn.

• **Hệ thống hỗ trợ khách hàng và quản trị toàn diện**. Người dùng có thể nhắn tin trực tiếp với admin để được hỗ trợ. Admin có thể quản lý toàn bộ hệ thống thông qua admin panel bao gồm: quản lý người dùng, sản phẩm, đơn hàng, yêu cầu rút tiền, chat hỗ trợ, hệ thống thưởng, và xem các báo cáo thống kê chi tiết về doanh thu, đơn hàng, người dùng.

---

## KẾT QUẢ DỰ KIẾN

– **Website SmartCash Shopping hoàn thiện**: Một website đầy đủ chức năng, đáp ứng các yêu cầu đã đề ra:

### Khách hàng:

- **Quản lý tài khoản**: Đăng ký, đăng nhập (email/password hoặc Google OAuth), xác thực tài khoản, đặt lại mật khẩu, xem và chỉnh sửa thông tin cá nhân, quản lý thông tin ngân hàng

- **Mua sắm**: Tra cứu sản phẩm, cửa hàng theo từ khóa, cửa hàng, danh mục; xem chi tiết sản phẩm; thêm giỏ hàng; mua sản phẩm qua link affiliate tự động; chuyển đổi link sản phẩm muốn mua thành link affiliate

- **Hoàn tiền và rút tiền**: Xem và chỉnh sửa thông tin cá nhân; kiểm tra số tiền hoàn (tổng cashback, số tiền có thể rút); xem lịch sử mua hàng với chi tiết cashback (bao gồm bonus từ hạng thành viên và voucher); yêu cầu rút tiền; xem lịch sử rút tiền

- **Hệ thống thưởng**: Xem hạng thành viên hiện tại và lợi ích; điểm danh hàng ngày để nhận voucher; xem và áp dụng voucher vào đơn hàng; xem mã giới thiệu và chia sẻ để nhận thưởng; xem bảng xếp hạng và thứ hạng của mình; quay vòng quay may mắn; chơi trò chơi vườn cây

- **Hỗ trợ**: Nhắn tin với admin; xem lịch sử chat; xem thông tin và hướng dẫn sử dụng

### Admin:

- **Dashboard và thống kê**: Xem tổng quan hệ thống với các chỉ số quan trọng; xem biểu đồ thống kê doanh thu, đơn hàng, người dùng; tạo báo cáo chi tiết

- **Quản lý người dùng**: Xem danh sách và chi tiết người dùng; chỉnh sửa thông tin; phân quyền (khách hàng, nhân viên, admin); quản lý tài khoản

- **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm; cập nhật thông tin sản phẩm; quản lý danh sách cửa hàng đối tác; quản lý link affiliate và thông tin affiliate; đồng bộ sản phẩm từ API bên thứ ba

- **Quản lý đơn hàng**: Xem danh sách và chi tiết đơn hàng; duyệt hoặc hủy đơn hàng; quản lý trạng thái hoàn tiền; xem thống kê về đơn hàng và cashback

- **Quản lý yêu cầu rút tiền**: Xem danh sách yêu cầu rút tiền; duyệt hoặc từ chối yêu cầu; quản lý thanh toán và giao dịch rút tiền; xem lịch sử rút tiền

- **Quản lý chat hỗ trợ**: Xem danh sách cuộc trò chuyện; trả lời tin nhắn từ người dùng; quản lý và theo dõi các yêu cầu hỗ trợ

- **Quản lý hệ thống thưởng**: Quản lý hệ thống hạng thành viên; quản lý voucher; quản lý phần thưởng leaderboard, vòng quay may mắn, trò chơi vườn cây, và điểm danh

- **Phân tích và báo cáo**: Tạo báo cáo về doanh thu, đơn hàng, người dùng; phân tích xu hướng và hiệu suất hệ thống; xuất dữ liệu để phân tích sâu hơn
