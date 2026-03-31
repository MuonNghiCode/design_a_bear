export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogoutRequest {
  refreshToken?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl: string;
  dateOfBirth: string;
  gender: "M" | "F";
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface GoogleLoginRequest {
  credential: string;
}

export interface GoogleCompleteProfileRequest {
  registrationToken: string;
  phoneNumber: string;
  password: string;
  fullName: string;
  dateOfBirth: string;
  gender: "M" | "F";
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber: string;
  dateOfBirth?: string;
  gender?: string;
  language?: string;
  timezone?: string;
  avatarUrl?: string;
  status?: string;
}

export interface CreateAddressRequest {
  userId: string;
  label?: string | null;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode?: string | null;
  country?: string | null;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export type UpdateAddressRequest = Omit<CreateAddressRequest, "userId">;

export interface GetProductsRequest {
  pageIndex?: number;
  pageSize?: number;
  productType?: string;
  sortBy?: string;
}

export interface GetProductReviewsRequest {
  pageIndex?: number;
  pageSize?: number;
}

export interface CreateReviewRequest {
  productId: string;
  userId: string;
  orderItemId: string;
  rating: number;
  title: string;
  body: string;
}

export interface UpdateReviewRequest {
  rating: number;
  title: string;
  body: string;
}

export interface CreateProductVariantRequest {
  sku: string;
  variantName: string;
  price: number;
  currency: string;
  imageUrl: string;
}

export interface CreateProductMediaRequest {
  url: string;
  altText: string;
  sortOrder: number;
}

export interface CreateProductRequest {
  name: string;
  slug: string;
  productType: string;
  description: string;
  model3DUrl: string;
  isPersonalizable: boolean;
  isActive: boolean;
  categoryIds: string[];
  characterIds: string[];
  variants: CreateProductVariantRequest[];
  media: CreateProductMediaRequest[];
}

export type UpdateProductRequest = CreateProductRequest;

/* ── Build API Requests ── */

export interface CreateBuildRequest {
  customerId: string | null;
  baseVariantId: string;
  buildName: string;
  personalizationNote: string;
  buildComponents: { optionVariantId: string }[];
}

export interface CreateOrderFromCartRequest {
    userId: string | null;
    shippingAddressId: string | null;
    billingAddressId: string | null;
    currency: string;
    subtotal: number;
    discountTotal: number;
    taxTotal: number;
    shippingTotal: number;
    grandTotal: number;
    notes?: string;
    promoCode?: string;
}

/* ── Cart API Requests ── */

export interface CreateCartRequest {
  customerId: string | null;
  currency: string;
}

export interface AddToCartRequest {
  cartId: string;
  variantId: string;
  buildId: string | null;
  quantity: number;
  unitPriceSnapshot: number;
}

/* ── Order API Requests ── */

export interface GetOrdersRequest {
  pageIndex?: number;
  pageSize?: number;
}

export interface UpdateOrderStatusRequest {
  status: string;
  notes?: string;
}

/* ── Promotion & Payment Requests ── */

export interface ValidatePromotionRequest {
    code: string;
}

export interface CreatePaymentRequest {
    orderId: string;
    itemName: string;
    quantity: number;
    amount: number;
    description?: string;
}

export interface ConfirmPaymentRequest {}
