# Frontend Update Summary - Multi-Promotions & Product Architecture Refactor

This document summarizes the major updates made to the Frontend codebase, including the transition to a simplified product model, multi-promotions, and shipping-related logic.

## 1. Product Architecture: Removal of Variants

We have simplified the product model by removing the `ProductVariant` layer. Products are now "flat", making the system more performant and easier to maintain.

- **Flattened Data Model**: Fields like `price`, `sku`, and `weightGram` have been moved from the variant level directly to the `Product` level.
- **Types**: Updated `src/types/responses.ts` (`Product` and `ProductDetail` interfaces).
- **Services**: `product.service.ts` now interacts with flat product objects.

---

## 2. Image Combination Algorithm (Image Matrix)

To support customizable bears, we implemented a dynamic image combination algorithm that updates the product image based on selected accessories.

- **Logic**: `src/components/product-detail/ProductDetailClient.tsx`
- **Combination Key**: We generate a unique `combinationKey` by taking the `productId` of all selected accessories, sorting them alphabetically, and joining them with a pipe (`|`).
- **Lookup**: This key is used to find the corresponding pre-rendered image in the `product.comboImages` array.

### Special Handling for AI Processor

The **AI Processor** is an internal electronic component and does not change the physical appearance of the bear.

- **Exception**: The algorithm explicitly filters out any addon with `productType === "AI_PROCESSOR"` or containing "AI PROCESSOR" in the name from the `combinationKey`.
- **Benefit**: This ensures that selecting an AI chip does not break the visual combination logic, as there is no "visible" difference to render.

---

## 3. Promotion System Overhaul

### Structured Discount Data

The system now distinguishes between **Product Discounts** and **Shipping Discounts**. APIs now return a breakdown instead of a single value.

- **File**: `src/types/responses.ts`
  - Added `PromotionApplyResponseData` interface featuring `productDiscount`, `shippingDiscount`, `totalDiscount`, and `discountType`.
- **File**: `src/services/payment.service.ts`
  - Updated `applyPromotion` and `validatePromotion` to include `shippingAmount` in requests and return the new structured response.

### Multi-Promotion Support

Customers can now apply multiple valid discount codes to a single order.

- **File**: `src/types/requests.ts`
  - Updated `CreateOrderFromCartRequest` to use `promoCodes: string[]`.
- **File**: `src/components/checkout/CheckoutClient.tsx`
  - Transitioned state from `coupon: string` to `appliedCoupons: AppliedCoupon[]`.
  - Updated total calculation logic to aggregate `totalProductDiscount` and `totalShippingDiscount`.

---

## 4. Checkout & Order Summary Improvements

### Unique Key Fix (Critical)

Fixed a console error and rendering instability caused by duplicate keys.

- **File**: `src/components/checkout/OrderSummary.tsx`
  - Changed rendering `key` from `product.id` to `cartItemId`.
  - **Reason**: `product.id` is non-unique if the cart contains multiple variants or custom builds of the same base product. `cartItemId` is guaranteed unique by the backend.

### UI Enhancements

- Displaying multiple applied coupons with a removal option.
- Distinguishing between FREE SHIP and shipping discounts in the price breakdown.

---

## 5. Cart Context & Stability

### Removing "State Jumping"

Resolved an issue where the cart UI would flicker or duplicate items momentarily during "Buy Now" transitions.

- **File**: `src/contexts/CartContext.tsx`
  - Refactored `addItem`: Removed the redundant `await loadCart()` call before addition.
  - Optimized `cartId` retrieval: Now pulls directly from `localStorage`, avoiding a full state refresh immediately before an optimistic update.
  - Result: Significantly faster addition flow and smoother UI transitions.

---

## 6. Admin Promotion Management

### New Discount Types

Admins can now create and manage shipping-specific incentives.

- **Files**: `src/components/admin/promotions/AddPromotionModal.tsx` & `UpdatePromotionModal.tsx`
  - Added `SHIPPING` (Percentage off ship fee) and `SHIPPING_FIXED` (Fixed amount off ship fee).
  - Updated Icon sets to include `MdLocalShipping`.

### Service Integration

- **File**: `src/services/promotion.service.ts`
  - New service implementing full CRUD for promotions to be shared across the admin dash.

---

## 7. Other Noteworthy Fixes

- **Method Mismatch**: Fixed 405 Method Not Allowed error in promotion validation by ensuring `POST` is used for validation and application endpoints.
- **Cart Drawer Animation**: Ensured items added to the cart appear at the top for better user feedback.

# BE

# Tài liệu Kỹ thuật: Quy trình Tổ hợp Sản phẩm & Cá nhân hóa (OVERHAUL REQUIRED)

> [!CAUTION]
> **CẢNH BÁO ĐỎ: TỔNG ĐẠI TU HỆ THỐNG BIẾN THỂ (PRODUCT VARIANTS REMOVAL)**
> Hệ thống vừa thực hiện một thay đổi kiến trúc cực lớn: **Loại bỏ hoàn toàn thực thể ProductVariant**.
>
> - Toàn bộ dữ liệu Giá (Price), SKU, Cân nặng (Weight) hiện đã được đưa trực tiếp vào thực thể **Product**.
> - **Frontend Team cần cập nhật lại toàn bộ logic gọi API:** Không còn `VariantId`, thay vào đó hãy sử dụng `ProductId`.
> - Các API Cart, Order, Inventory đều đã chuyển sang dùng `ProductId`.

---

## 1. Logic Tổ hợp Hình ảnh (Product Combo Images)

Hệ thống sử dụng cơ chế **Combination Key** để xác định hình ảnh hiển thị cho một bộ phối gấu bông và phụ kiện cụ thể.

### 1.1. Cách tạo Combination Key

Để đảm bảo tính duy nhất và không phụ thuộc vào thứ tự chọn của người dùng, Key được tạo theo quy tắc:

1.  Lấy danh sách ID (Guid) của tất cả các phụ kiện đã chọn.
2.  **LOẠI TRỪ** các phụ kiện có loại là `AI_PROCESSOR` (vì loại này không có logic hình ảnh).
3.  **Sắp xếp (Sort)** danh sách ID còn lại theo thứ tự tăng dần.
4.  Nối các ID bằng dấu gạch đứng `|`.

**Ví dụ:**

- Phụ kiện A (ID: `1111...`) + Phụ kiện B (ID: `2222...`) + AI Processor (ID: `9999...`)
- Key: `1111...|2222...` (ID của AI Processor bị loại bỏ khỏi key)

### 1.2. Thuật toán tìm kiếm hình ảnh

Backend cung cấp API để Frontend truy vấn ảnh dựa trên `base_product_id` và `combination_key`:

- Sử dụng `ProductComboImageRepository` để truy vấn trong bảng `product_combo_images`.
- Nếu một tổ hợp hợp lệ nhưng không có ảnh trong DB, Backend sẽ trả về ảnh mặc định của Gấu Base.

---

## 2. Phụ kiện AI Processor (Thay thế Smart Chip cũ)

Hệ thống đã loại bỏ logic "SmartChipPrice" trong Product và chuyển sang sử dụng một thực thể phụ kiện độc lập.

### 2.1. Logic nghiệp vụ

- **Tên**: AI Processor (hoặc tương đương).
- **Product Type**: `AI_PROCESSOR`.
- **Giá cố định**: **999,000 VND**.
- **Tính chất**: Là một phụ kiện tùy chọn (Accessory) nhưng **không tham gia** vào logic tổ hợp hình ảnh.

### 2.2. Hướng dẫn Frontend

Để triển khai luồng chọn AI trong UI:

- **Hiển thị**: Coi AI Processor như một phụ kiện đặc biệt trong danh sách phụ kiện.
- **Thêm vào giỏ hàng**:
  - Không còn field `includes_smart_chip`.
  - Thêm AI Processor vào giỏ hàng như một item độc lập hoặc một component trong Build.
- **Tổng tiền**: Hệ thống sẽ tự động tính toán dựa trên `Product.Price`.

---

## 3. Quy trình Cá nhân hóa & Sản xuất (Production Jobs)

Mỗi con gấu thực tế (theo số lượng `Quantity`) sẽ có một quy trình sản xuất riêng.

### 3.1. Phân tách Job

- Khi đơn hàng được xác nhận, mỗi `OrderItem` sẽ sinh ra các `ProductionJob` tương ứng với số lượng trong item đó.
- Mỗi Job đại diện cho **1 đơn vị sản phẩm vật lý**.

### 3.2. Số Serial & Dữ liệu

- **Serial Number**: Định dạng `SN-{yyyyMMdd}-{8_ký_tự_ngẫu_nhiên}`.
- **Print Data**: Lưu trữ JSON bao gồm ghi chú cá nhân hóa và các thành phần trong Build.

---

## 4. Đặc tả API mới (Breaking Changes)

| Chức năng         | API Cũ (Dùng Variant)                   | API Mới (Dùng Product)                             |
| :---------------- | :-------------------------------------- | :------------------------------------------------- |
| Thêm giỏ hàng     | `{ "variantId": "...", "quantity": 1 }` | `{ "productId": "...", "quantity": 1 }`            |
| Chi tiết sản phẩm | Có mảng `variants`                      | Dùng trực tiếp `price`, `sku`, `weightGram` ở root |
| Kho hàng          | Truy vấn theo `variantId`               | Truy vấn theo `productId`                          |
| Luật combo        | Dựa trên `variant`                      | Dựa trên `product`                                 |

> [!IMPORTANT]
> Toàn bộ logic Frontend liên quan đến "Biến thể" cần được xóa bỏ để đơn giản hóa giao diện. Hệ thống hiện tại chỉ còn: **Sản phẩm chính + Các phụ kiện kèm theo**.
