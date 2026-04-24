# 🎨 UI Design Standards

Tài liệu này định nghĩa các tiêu chuẩn về thị giác cho dự án Design a Bear.

## 🎨 Bảng màu (Color Palette)

### Màu chính
| Token | Hex | Mô tả | Dùng cho |
| :--- | :--- | :--- | :--- |
| `--color-primary` | `#17409A` | **Xanh navy chủ đạo** | CTA buttons, headings, icons chính |
| `--color-bg` | `#F4F7FF` | **Nền sáng xanh nhạt** | Background chính toàn trang |

### Bảng màu mở rộng
| Token | Hex | Mô tả | Dùng cho |
| :--- | :--- | :--- | :--- |
| `--color-primary-light` | `#4A90E2` | Xanh dương sáng | Hover states, highlights |
| `--color-accent-warm` | `#FF8C42` | Cam ấm | Highlights trẻ em, sale badges |
| `--color-accent-green` | `#4ECDC4` | Xanh mint | Success state, "in stock" |
| `--color-text-primary` | `#1A1A2E` | Gần đen | Body text chính |
| `--color-white` | `#FFFFFF` | Trắng | Card backgrounds, navbar bg |

> [!CAUTION]
> **TUYỆT ĐỐI KHÔNG** dùng `linear-gradient`. Tất cả phải dùng màu solid.

## ✍️ Typography

- **Heading**: `'Fredoka'` (Google Fonts) — Tròn trịa, thân thiện.
- **Body**: `'Inter'` hoặc `'Geist Sans'` — Hiện đại, dễ đọc.
- **Vietnamese Support**: Dùng `'Nunito'` (700/800/900) cho các nội dung tiếng Việt quan trọng.

## 📐 Layout & Spacing

- **Container**: `max-w-screen-2xl mx-auto px-8 md:px-16`.
- **Border Radius**: 
  - Cards: `rounded-3xl` (24px).
  - Buttons/Inputs: `rounded-2xl` (16px).
- **Shadows**: Dùng `shadow-lg` cho card và `shadow-xl` cho CTA buttons.

## 🧩 Quy tắc thiết kế Component

### Cards
- Nền trắng, shadow mịn, bo góc lớn.
- Hover: `scale-[1.02]` và tăng shadow.

### Buttons
- Primary: Nền Navy, chữ trắng, bo góc 2xl.
- Secondary: Viền Navy, nền trắng, chữ Navy.
- Icon Button: Hình tròn, nền nhạt 10% opacity.

---

## 🎭 Yếu tố trang trí & Responsive

### Phải có trong mỗi page
1. **Bear-related**: Dấu chân gấu (paw prints), bóng gấu (bear silhouettes), ngôi sao, trái tim (opacity nhẹ).
2. **Wave dividers**: Dùng các đường kẻ lượn sóng/cong giữa các section (SVG màu solid).
3. **Glassmorphism**: Sử dụng cho Navbar (`bg-white/70 backdrop-blur-sm`).

### 📱 Responsive Design
- **Mobile (< 640px)**: 1 cột, spacing gọn, menu hamburger.
- **Tablet (≥ 768px)**: 2-3 cột, header đầy đủ.
- **Desktop (≥ 1280px)**: 4 cột, layout tối đa.
- **Quy tắc**: Touch targets tối thiểu 44x44px. Font size tối thiểu 14px trên mobile.

---

## ⚠️ Những điều CẦN TRÁNH (Pitfalls)
1. ❌ **GRADIENT**: Tuyệt đối không dùng.
2. ❌ **Animation lố**: Không bounce, không elastic, không scale lớn (>1.05).
3. ❌ **Layout phẳng**: Luôn phải có sự phá cách, các yếu tố chồng lớp nhẹ (overlapping).
4. ❌ **Placeholder**: Luôn dùng hình ảnh thực từ `generate_image`.
5. ❌ **Font hệ thống**: Luôn import font từ Google Fonts theo quy định.

