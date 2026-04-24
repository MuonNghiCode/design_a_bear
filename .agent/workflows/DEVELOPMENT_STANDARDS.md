---
description: 
---

# 🏗️ Development & Architecture Standards

Tài liệu này định nghĩa quy chuẩn về cấu trúc mã nguồn và quản lý dữ liệu cho dự án.

## 🧱 Component Architecture

- **Quy tắc TUYỆT ĐỐI**: Mọi trang đều PHẢI được chia thành các component nhỏ. 
- File `page.tsx` chỉ đóng vai trò **orchestrator** (import và sắp xếp các component).
- Cấu trúc thư mục:
  - `src/app/[tên-trang]/page.tsx`
  - `src/components/[tên-trang]/[SectionName].tsx`

## 📡 API Structure Rules

1. **Base Service**: Mọi Service phải kế thừa từ `BaseApiService`.
2. **Endpoint Management**: Sử dụng `API_ENDPOINTS` constant.
3. **ApiResponse Wrapper**: Mọi phản hồi từ API phải đi qua interface `ApiResponse<T>`.
4. **No Direct Axios**: Không gọi axios trực tiếp trong UI components. Sử dụng Services hoặc Custom Hooks.
5. **Request/Repose**: Mọi request response phải đặt trong file request 

## 📂 Data & Type Separation

- **KHÔNG** đặt mock data hoặc TypeScript interfaces trực tiếp trong file component.
- **Thư mục quy định**:
  - `src/data/*.ts`: Chứa mock data, constant arrays.
  - `src/types/*.ts`: Chứa interfaces, types, enums theo domain.
- File component chỉ thực hiện `import`.

## 🏷️ Đặt tên (Naming Conventions)

- **Components**: PascalCase (ví dụ: `ProductCard.tsx`).
- **Hooks**: camelCase bắt đầu bằng `use` (ví dụ: `useAuth.ts`).
- **Services**: camelCase kết thúc bằng `.service.ts` (ví dụ: `order.service.ts`).
- **Files/Folders**: kebab-case cho thư mục app router.

---

## 🏗️ Cấu trúc trang khuyến nghị (Recommended Structures)

### Trang chủ (Home)
1. **Hero Section**: Banner lớn, gấu bông 3D/Illustration, tagline, CTA.
2. **Featured Products**: Grid sản phẩm nổi bật.
3. **How It Works**: 3-4 bước giải thích IoT/AI.
4. **Collections**: Showcase các bộ sưu tập theo chủ đề.

### Trang sản phẩm & Chi tiết
1. **Filter Sidebar**: Lọc theo loại, giá, tính năng.
2. **Product Grid**: Cards với đầy đủ badge AI/IoT.
3. **Detail Page**: Gallery hình ảnh lớn, mô tả tính năng AI, chọn phụ kiện, đánh giá.

