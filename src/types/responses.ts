import { AccessoryResponse } from "./accessory";

export interface ApiResponse<T> {
  value: T;
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    description: string;
  };
}

/* ── Order API Responses ── */

export interface OrderItem {
  orderItemId: string;
  orderId: string;
  productId?: string;
  variantId?: string | null;
  productName?: string;
  productImageUrl?: string | null;
  variantName?: string | null;
  sku?: string;
  unitPrice: number;
  quantity: number;
  totalPrice?: number;
  notes?: string | null;
  buildId?: string | null;
  lineTotal?: number;
  productNameSnapshot?: string | null;
  personalizationSnapshot?: string | null;
  productionJobs?: {
    jobId: string;
    orderItemId: string;
    status: string;
    assignedUser: string | null;
    startedAt: string | null;
    completedAt: string | null;
    serialNumber: string;
  }[];
}

export interface OrderListItem {
  orderId: string;
  orderNumber: string;
  userId: string | null;
  shippingAddressId: string | null;
  billingAddressId: string | null;
  status: string;
  currency: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  grandTotal: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface Order {
  orderId: string;
  orderNumber: string;
  userId: string | null;
  shippingAddressId: string | null;
  billingAddressId: string | null;
  status: string;
  currency: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  grandTotal: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface GetOrdersResponseData {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: OrderListItem[];
}

export interface LoginResponseData {
  token: string;
  message: string;
}

export interface LogoutResponseData {
  loggedOut: boolean;
  message?: string;
}

export interface ProfileResponseData {
  userId: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  language?: string;
  timezone?: string;
  avatarUrl: string | null;
  provider: string;
  status: string;
  roleName: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerifyEmailResponseData {
  token: string;
  message: string;
}

export interface GoogleLoginResponseData {
  token?: string;
  message?: string;
  registrationToken?: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: "M" | "F";
}

export interface GoogleCompleteProfileResponseData {
  token: string;
  message?: string;
}

/* ── Product API Responses ── */

export interface ProductMedia {
  mediaId: string;
  productId: string;
  url: string;
  sortOrder: number;
  altText: string;
}

export interface ProductListItem {
  productId: string;
  name: string;
  slug: string;
  isActive: boolean;
  imageUrl: string | null;
  price: number;
  sku: string;
  weightGram: number;
  shortDescription: string;
  totalSales: number;
  minPrice: number;
  viewCountIn10Min: number;
  discountRate: number;
  averageRating: number;
  reviewCount: number;
  media: ProductMedia[];
  productType?: string;
  onHand?: number;
  reserved?: number;
}

export interface GetProductsResponseData {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: ProductListItem[];
}

export interface ProductCategory {
  categoryId: string;
  parentId: string | null;
  name: string;
  slug: string;
  isActive?: boolean;
}

export interface CharacterItem {
  characterId: string;
  name: string;
  slug: string;
  licenseBrand: string | null;
}

export type GetCategoriesResponse = ApiResponse<ProductCategory[]>;
export type GetCategoryResponse = ApiResponse<ProductCategory>;

export type GetCharactersResponse = ApiResponse<CharacterItem[]>;
export type GetCharacterResponse = ApiResponse<CharacterItem>;

export interface ProductReview {
  reviewId: string;
  productId: string;
  userId: string;
  authorName?: string | null;
  authorAvatar?: string | null;
  orderItemId: string | null;
  rating: number;
  title: string;
  body: string;
  status: string;
  createdAt: string;
  reviewReplies: ReviewReply[];
}

export interface ReviewReply {
  replyId: string;
  reviewId: string;
  staffUserId: string;
  content: string;
  createdAt: string;
}

export interface Product {
  productId: string;
  name: string;
  slug: string;
  description?: string;
  isPersonalizable: boolean;
  isActive: boolean;
  price: number;
  baseCost: number;
  assemblyCost: number;
  sku: string;
  imageUrl?: string | null;
  weightGram: number;
  badge?: string;
  badgeColor?: string;
  createdAt: string;
  updatedAt: string;
  media: ProductMedia[];
  productType?: string;
  onHand?: number;
  reserved?: number;
}

export interface ProductVariant {
  variantId: string;
  productId: string;
  sku: string;
  name?: string;
  price: number;
  baseCost: number;
  assemblyCost: number;
  weightGram?: number;
  onHand: number;
  reserved: number;
  quantityAvailable: number;
  sizeTag?: string;
  sizeDescription?: string;
}

export interface ProductDetail extends Product {
  categories: ProductCategory[];
  characters: CharacterItem[];
  model3DUrl?: string;
  reviews?: ProductReview[];
  comboImages: ProductComboImage[];
  variants: ProductVariant[];
  accessories?: AccessoryResponse[];
}

export interface ProductComboImage {
  comboId: string;
  combinationKey: string;
  imageUrl: string;
}

export interface ProductListResponseData {
  items: Product[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

export interface GetProductReviewsResponseData {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: ProductReview[];
}

/* ── Cart API Responses ── */

export interface CartItem {
  cartItemId: string;
  cartId: string;
  productId: string;
  buildId: string | null;
  quantity: number;
  unitPriceSnapshot: number;
  variantName: string;
  variantPrice: number;
  sku: string;
  productName: string;
  productImageUrl?: string | null;
  productNameSnapshot?: string | null;
  variantNameSnapshot?: string | null;
  productSlug: string;
  variantId?: string;
  size?: string;
  sizeTag?: string;
  build?: any;
  productType?: string;
}

export interface Cart {
  cartId: string;
  userId: string | null;
  currency: string;
  createdAt: string;
  updatedAt: string;
  cartItems: CartItem[];
}

/* ── Personalization ── */

export interface PersonalizationRule {
  ruleId: string;
  baseProductId: string;
  groupId: string;
  allowedComponentProductId: string;
  isRequired: boolean;
  maxQuantity: number;
  ruleType: "OPTIONAL" | "REQUIRED" | "ACCESSORY" | string;
  addonProduct: ProductDetail;
}

export interface GetPersonalizationRulesAdminResponseData {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: PersonalizationRule[];
}

export interface PersonalizationGroup {
  groupId: string;
  name: string;
  description: string | null;
}

/* ── Build API Responses ── */

export interface BuildComponent {
  buildComponentId: string;
  buildId: string;
  optionVariantId: string;
  priceSnapshot: number;
  createdAt: string;
  updatedAt: string;
}

export interface Build {
  buildId: string;
  customerId: string | null;
  baseVariantId: string;
  buildName: string;
  personalizationNote: string;
  totalWeightGram: number | null;
  calculatedPrice: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  buildComponents: BuildComponent[];
}

export interface Address {
  addressId: string;
  userId: string;
  label: string | null;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string | null;
  country: string | null;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  createdAt: string;
}

export interface AddressDetail {
  addressId: string;
  userId: string;
  label: string | null;
  fullName: string;
  phoneNumber: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string | null;
  country: string | null;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  createdAt: string;
}

export interface Promotion {
  promotionId: string;
  code: string;
  discountType: string;
  value: number;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  minOrderAmount: number;
  maxUsageCount: number | null;
  usageCount: number;
  maxUsagePerUser: number | null;
  description: string | null;
}

export interface PromotionResponseData {
  items: Promotion[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

export interface PromotionApplyResponseData {
  productDiscount: number;
  shippingDiscount: number;
  totalDiscount: number;
  discountType: string;
}

export interface CreatePaymentResponseData {
  checkoutUrl?: string;
  paymentCode?: string;
  orderCode?: string;
  paymentUrl?: string;
  message?: string;
}

export interface ConfirmPaymentResponseData {
  paymentCode: string;
  status: string;
  transactionId?: string;
  message?: string;
}

export interface MediaUploadData {
  fileName: string;
  filePath: string;
  publicUrl: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
}

/* ── User API Responses ── */

export interface UserDetail {
  userId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  provider: string;
  status: string;
  roleName: string;
  createdAt: string;
  updatedAt: string;
}

export type GetUserResponse = ApiResponse<UserDetail>;
export type GetUsersResponse = ApiResponse<UserDetail[]>;

/* ── Report API Responses ── */

export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface RevenueReportData {
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  dailyBreakdown: DailyRevenue[];
}

export type ProductIssueStatus =
  | "PENDING"
  | "PROCESSING"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED";

export interface ProductIssueReport {
  reportId: string;
  userId: string;
  orderItemId: string;
  orderId?: string;
  productId?: string;
  type?: string;
  description: string;
  requestRefund: boolean;
  evidenceUrls: string[];
  status: ProductIssueStatus;
  staffId?: string | null;
  resolution?: string | null;
  staffNotes?: string | null;
  repairNotes?: string | null;
  finalNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type GetProductIssuesResponseData = {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: ProductIssueReport[];
};

export type GetRevenueReportResponse = ApiResponse<RevenueReportData>;
export type GetProductIssuesResponse =
  ApiResponse<GetProductIssuesResponseData>;

/* ── Aggregated export aliases ── */

export type ProfileResponse = ApiResponse<ProfileResponseData>;
export type RegisterResponse = ApiResponse<string>;
export type VerifyEmailResponse = ApiResponse<VerifyEmailResponseData>;
export type GoogleLoginResponse = ApiResponse<GoogleLoginResponseData>;
export type GoogleCompleteProfileResponse =
  ApiResponse<GoogleCompleteProfileResponseData>;
export type GetProductsResponse = ApiResponse<GetProductsResponseData>;
export type GetProductDetailResponse = ApiResponse<ProductDetail>;
export type GetProductReviewsResponse =
  ApiResponse<GetProductReviewsResponseData>;
export type GetAllReviewsResponse = ApiResponse<GetProductReviewsResponseData>;
export type GetUserReviewsResponse = ApiResponse<ProductReview[]>;
export type CanReviewProductResponse = ApiResponse<boolean>;
export type CreateReviewResponse = ApiResponse<ProductReview>;
export type UpdateReviewResponse = ApiResponse<null>;
export type DeleteReviewResponse = ApiResponse<null>;
export type GetProductAverageRatingResponse = ApiResponse<number>;
export type ApproveReviewResponse = ApiResponse<null>;
export type RejectReviewResponse = ApiResponse<null>;
export type ReplyReviewResponse = ApiResponse<ReviewReply>;
export type GetReviewRepliesResponse = ApiResponse<ReviewReply[]>;
export type GetCartResponse = ApiResponse<Cart>;
export type AddToCartResponse = ApiResponse<CartItem>;
export type GetPersonalizationRulesResponse = ApiResponse<
  PersonalizationRule[]
>;
export type GetPersonalizationGroupsResponse = ApiResponse<
  PersonalizationGroup[]
>;
export type GetPersonalizationGroupResponse = ApiResponse<PersonalizationGroup>;
export type CreatePersonalizationGroupResponse =
  ApiResponse<PersonalizationGroup>;
export type UpdatePersonalizationGroupResponse = ApiResponse<null>;
export type DeletePersonalizationGroupResponse = ApiResponse<null>;
export type GetPersonalizationRulesAdminResponse = ApiResponse<
  GetPersonalizationRulesAdminResponseData | PersonalizationRule[]
>;
export type GetPersonalizationRuleResponse = ApiResponse<PersonalizationRule>;
export type CreatePersonalizationRuleResponse =
  ApiResponse<PersonalizationRule>;
export type UpdatePersonalizationRuleResponse = ApiResponse<null>;
export type DeletePersonalizationRuleResponse = ApiResponse<null>;
export type PromotionResponse = ApiResponse<PromotionResponseData>;
export type PromotionApplyResponse = ApiResponse<PromotionApplyResponseData>;
export type CreatePaymentResponse = ApiResponse<CreatePaymentResponseData>;
export type ConfirmPaymentResponse = ApiResponse<ConfirmPaymentResponseData>;
export type MediaUploadResponse = ApiResponse<MediaUploadData>;
export type GetAddressByIdResponse = ApiResponse<AddressDetail>;
export type GetAddressesResponse = ApiResponse<Address[]>;
export type CreateBuildResponse = ApiResponse<Build>;
export type GetOrdersResponse = ApiResponse<GetOrdersResponseData>;
export type GetOrderByIdResponse = ApiResponse<OrderListItem>;
export type GetOrdersByUserResponse = ApiResponse<Order[]>;
export type GetOrderDetailResponse = ApiResponse<Order>;
export type CreateOrderResponse = ApiResponse<Order>;
export type LogoutResponse = ApiResponse<LogoutResponseData>;
export type LoginResponse = ApiResponse<LoginResponseData>;

export interface FavoriteResponse {
  favoriteId: string;
  productId: string;
  productName: string;
  productImageUrl?: string;
  productPrice: number;
  createdAt: string;
}

export interface GetMyFavoritesResponseData {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: FavoriteResponse[];
}

export type GetMyFavoritesResponse = ApiResponse<GetMyFavoritesResponseData>;
export type ToggleFavoriteResponse = ApiResponse<{ isAdded: boolean; message: string }>;

