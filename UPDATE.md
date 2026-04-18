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
