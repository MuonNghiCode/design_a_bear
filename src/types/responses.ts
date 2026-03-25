export interface ApiResponse<T> {
    value: T;
    isSuccess: boolean;
    isFailure: boolean;
    error: {
        code: string;
        description: string;
    };
}

export interface LoginResponseData {
    token: string;
    message: string;
}

export type LoginResponse = ApiResponse<LoginResponseData>;

export interface LogoutResponseData {
    loggedOut: boolean;
    message?: string;
}

export type LogoutResponse = ApiResponse<LogoutResponseData>;

export interface ProfileResponseData {
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
    productType: string;
    isActive: boolean;
    imageUrl: string | null;
    price: number;
    shortDescription: string;
    totalSales: number;
    minPrice: number;
    viewCountIn10Min: number;
    discountRate: number;
    averageRating: number;
    reviewCount: number;
    media: ProductMedia[];
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



export interface ProductVariant {
    variantId: string;
    productId: string;
    sku: string;
    variantName: string;
    price: number;
    currency: string;
    isSoldOut: boolean;
    imageUrl: string | null;
}

export interface ProductCategory {
    categoryId: string;
    parentId: string | null;
    name: string;
    slug: string;
}

export interface ProductReview {
    reviewId: string;
    productId: string;
    userId: string;
    orderItemId: string | null;
    rating: number;
    title: string;
    body: string;
    status: string;
    createdAt: string;
    reviewReplies: unknown[];
}

export interface ProductDetail {
    productId: string;
    name: string;
    slug: string;
    productType: string;
    description: string;
    isPersonalizable: boolean;
    isActive: boolean;
    price: number;
    createdAt: string;
    updatedAt: string;
    model3DUrl: string | null;
    media: ProductMedia[];
    variants: ProductVariant[];
    categories: ProductCategory[];
    reviews: ProductReview[];
}

export interface CartItem {
    cartItemId: string;
    cartId: string;
    variantId: string;
    buildId: string | null;
    quantity: number;
    unitPriceSnapshot: number;
    variantName: string;
    variantPrice: number;
    sku: string;
    productName: string;
    productSlug: string;
    productType: string;
}

export interface Cart {
    cartId: string;
    customerId: string | null;
    currency: string;
    createdAt: string;
    updatedAt: string;
    cartItems: CartItem[];
}

export interface PersonalizationRule {
    ruleId: string;
    baseProductId: string;
    groupId: string;
    allowedComponentProductId: string;
    isRequired: boolean;
    maxQuantity: number;
    ruleType: "OPTIONAL" | "REQUIRED";
    addonProduct: ProductDetail; // Same structure as ProductDetail
}

export type ProfileResponse = ApiResponse<ProfileResponseData>;
export type RegisterResponse = ApiResponse<string>;
export type VerifyEmailResponse = ApiResponse<VerifyEmailResponseData>;
export type GoogleLoginResponse = ApiResponse<GoogleLoginResponseData>;
export type GoogleCompleteProfileResponse = ApiResponse<GoogleCompleteProfileResponseData>;
export type GetProductsResponse = ApiResponse<GetProductsResponseData>;
export type GetProductDetailResponse = ApiResponse<ProductDetail>;
export type GetCartResponse = ApiResponse<Cart>;
export type AddToCartResponse = ApiResponse<CartItem>;
export type GetPersonalizationRulesResponse = ApiResponse<PersonalizationRule[]>;

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

export type CreateBuildResponse = ApiResponse<Build>;

/* ── Address & Order API Responses ── */

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

export interface OrderItem {
    orderItemId: string;
    orderId: string;
    variantId: string;
    buildId: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    productNameSnapshot: string | null;
    personalizationSnapshot: string | null;
    // productionJobs omitted or can be added if needed
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

export type GetAddressesResponse = ApiResponse<Address[]>;
export type CreateOrderResponse = ApiResponse<Order>;

/* ── Promotion & Payment Responses ── */

export interface PromotionResponseData {
    // value is empty array as per backend spec
}

export type PromotionResponse = ApiResponse<PromotionResponseData>;

export interface CreatePaymentResponseData {
    checkoutUrl?: string;
    paymentCode?: string;
    orderCode?: string;
    paymentUrl?: string;
    message?: string;
}

export type CreatePaymentResponse = ApiResponse<CreatePaymentResponseData>;

export interface ConfirmPaymentResponseData {
    paymentCode: string;
    status: string;
    transactionId?: string;
    message?: string;
}

export type ConfirmPaymentResponse = ApiResponse<ConfirmPaymentResponseData>;
