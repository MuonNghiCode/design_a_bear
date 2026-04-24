# 🏗️ Management UI Standards (Staff, Admin, Craftsman, QC)

Tài liệu này định nghĩa các quy tắc dành riêng cho hệ thống quản lý, hướng tới sự sang trọng, tinh gọn và hiệu suất cao.

## 🎨 Triết lý thiết kế (Management Aesthetics)

- **Sạch sẽ & Tinh tế (Clean & Sophisticated)**:
  - Sử dụng các tông màu trung tính (Slate, White, Cool Gray).
  - Tránh dùng quá nhiều màu sắc rực rỡ để tập trung vào dữ liệu.
- **Phân cấp thị giác**: Sử dụng whitespace và shadow thay cho các đường kẻ border dày đặc.
- **Focus Mode**: Loại bỏ các yếu tố gây xao nhãng. Mỗi màn hình tập trung vào một tác vụ chính.

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
