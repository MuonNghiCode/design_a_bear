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
  searchTerm?: string;
}

export interface GetProductReviewsRequest {
  pageIndex?: number;
  pageSize?: number;
}

export interface CreateCategoryRequest {
  parentId?: string | null;
  name: string;
  slug: string;
}
export type UpdateCategoryRequest = CreateCategoryRequest;

export interface CreateCharacterRequest {
  name: string;
  slug: string;
  licenseBrand?: string | null;
}
export type UpdateCharacterRequest = CreateCharacterRequest;

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

export interface GetAllReviewsRequest {
  pageIndex?: number;
  pageSize?: number;
  status?: string;
}

export interface StaffReplyReviewRequest {
  staffUserId: string;
  reviewId: string;
  content: string;
}

export interface UpdateReplyReviewRequest {
  staffUserId: string;
  content: string;
}

export interface CreateProductMediaRequest {
  url: string;
  altText: string;
  sortOrder: number;
}

export interface CreateProductVariantRequest {
  sku: string;
  price: number;
  weightGram: number;
  sizeTag: string; // XS, S, M, L, XL, XXL, OS
  sizeDescription: string; // Real dimensions e.g. "25cm"
  baseCost: number;
  assemblyCost: number;
  stockQuantity: number;
}

export interface CreateProductRequest {
  name: string;
  slug: string;
  productType: string;
  description: string;
  isPersonalizable: boolean;
  isActive: boolean;
  price: number;
  sku: string;
  weightGram: number;
  stockQuantity: number;
  model3DUrl?: string;
  categoryIds: string[];
  characterIds: string[];
  accessoryIds: string[];
  media: CreateProductMediaRequest[];
  comboImages?: CreateProductComboImageRequest[];
  variants?: CreateProductVariantRequest[];
}

export interface CreateProductComboImageRequest {
  combinationKey: string;
  imageUrl: string;
}

export type UpdateProductRequest = CreateProductRequest;

/* ── Build API Requests ── */

export interface CreateBuildRequest {
  customerId: string | null;
  baseProductId: string;
  buildName: string;
  personalizationNote: string;
  includesSmartChip?: boolean;
  buildComponents: { optionProductId: string }[];
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
  promoCodes?: string[];
}

/* ── Cart API Requests ── */

export interface CreateCartRequest {
  userId: string | null;
  currency: string;
}

export interface AddToCartRequest {
  cartId: string;
  productId: string;
  variantId?: string | null;
  buildId: string | null;
  includesSmartChip?: boolean;
  quantity: number;
  unitPriceSnapshot: number;
  productImageUrlSnapshot?: string | null;
  sizeTag?: string;
  sizeDescription?: string;
}

/* ── Personalization Group API Requests ── */

export interface CreatePersonalizationGroupRequest {
  name: string;
  description: string | null;
}

export type UpdatePersonalizationGroupRequest =
  CreatePersonalizationGroupRequest;

/* ── Personalization Rule API Requests ── */

export interface GetPersonalizationRulesAdminRequest {
  pageIndex?: number;
  pageSize?: number;
  baseProductId?: string;
  addonProductId?: string;
  groupId?: string;
  ruleType?: string;
}

export interface CreatePersonalizationRuleRequest {
  baseProductId: string;
  groupId: string;
  allowedComponentProductId: string;
  isRequired: boolean;
  maxQuantity: number;
  ruleType: string;
}

export interface UpdatePersonalizationRuleRequest {
  isRequired: boolean;
  maxQuantity: number;
  ruleType: string;
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

export interface CreatePromotionRequest {
  code: string;
  discountType: string;
  value: number;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  minOrderAmount: number;
  maxUsageCount: number | null;
  maxUsagePerUser: number | null;
  description: string | null;
}

export type UpdatePromotionRequest = CreatePromotionRequest;

export interface ValidatePromotionRequest {
  code: string;
  userId?: string;
  orderAmount?: number;
  shippingAmount?: number;
}

export interface ApplyPromotionRequest {
  code: string;
  userId: string;
  orderAmount: number;
  shippingAmount: number;
}

export interface CreatePaymentRequest {
  orderId: string;
  itemName: string;
  quantity: number;
  amount: number;
  description?: string;
}

export interface ConfirmPaymentRequest {}

/* ── Report API Requests ── */
export interface GetRevenueReportRequest {
  startDate: string;
  endDate: string;
}

export interface ToggleFavoriteRequest {
  productId: string;
}

/* ── Accessory API Requests ── */

export interface CreateAccessoryRequest {
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  baseCost: number;
  assemblyCost: number;
  targetPrice: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface UpdateAccessoryRequest {
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  baseCost: number;
  assemblyCost: number;
  targetPrice: number;
  stockQuantity: number;
  isActive: boolean;
}
