# 🏗️ Management UI Standards (Staff, Admin, Craftsman, QC)

Tài liệu này định nghĩa các quy tắc dành riêng cho hệ thống quản lý, hướng tới sự sang trọng, tinh gọn và hiệu suất cao.

## 🎨 Triết lý thiết kế (Management Aesthetics)

- **Sạch sẽ & Tối giản (Clean & Minimal)**:
  - Sử dụng Trắng và Slate cực nhạt làm màu chủ đạo để không gian làm việc thoáng đãng.
  - **Hạn chế màu sắc**: Chỉ sử dụng màu Navy chủ đạo cho các hành động chính. Các màu khác (Mint, Orange) chỉ dùng cho trạng thái chức năng (Status) dưới dạng pastel nhạt để tránh gây rối mắt.
- **Phân cấp thị giác**: Sử dụng whitespace và shadow tinh tế thay cho các đường kẻ border.
- **Yếu tố trang trí**: Sử dụng các họa tiết gấu bông mờ (opacity 2-3%) một cách tiết chế ở các khoảng trắng lớn, đảm bảo không làm phân tâm khi đọc dữ liệu.
- **Focus Mode**: Loại bỏ các yếu tố trang trí dư thừa trong các bảng dữ liệu phức tạp.

## 🧭 Quy tắc Điều hướng (Navigation Standards)

- **TUYỆT ĐỐI KHÔNG dùng Pop-up/Modal cho Add/Edit/Detail**: 
  - Điều hướng sang trang riêng biệt: `/[role]/[entity]/[id]`.
  - Sử dụng Breadcrumbs và nút "Quay lại" rõ ràng.
- **URL-based State**: Trạng thái chi tiết phải được phản ánh trên URL.

## ⚠️ Hệ thống xác nhận (Custom Confirmations)

- **KHÔNG sử dụng `window.confirm()` hay `window.alert()`**:
  - Sử dụng **ConfirmDialog** tùy chỉnh với hiệu ứng GSAP (scale/opacity).
  - Nút xác nhận xóa (Delete) dùng màu đỏ nhạt (`bg-red-500/10 text-red-600`) để sang trọng hơn.

## 📋 Bảng dữ liệu (Management Tables)

- **Hover state**: Luôn có hiệu ứng `bg-slate-50` khi di chuột qua dòng.
- **Action Buttons**: Sử dụng icon tinh gọn với Tooltip.
- **Trạng thái (Status Tags)**: Dùng kiểu pill/badge với màu nền rất nhạt (opacity 10-15%) và chữ đậm màu.

## 📄 Bố cục chi tiết trang (Detail Page Layout)

- **Page Header**: Tiêu đề lớn bên trái, các nút hành động chính bên phải.
- **Sectioning**: Chia thông tin vào các nhóm logic (ví dụ: Thông tin khách hàng, Danh sách sản phẩm, Thanh toán).
- **Sticky Actions**: Các nút Lưu/Hủy có thể được đặt cố định ở chân trang hoặc đầu trang khi cuộn.
