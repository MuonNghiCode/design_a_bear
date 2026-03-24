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
    id: string;
    userName?: string;
    name?: string;
    email: string;
    role?: string;
    avatar?: string;
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

export type ProfileResponse = ApiResponse<ProfileResponseData>;
export type RegisterResponse = ApiResponse<string>;
export type VerifyEmailResponse = ApiResponse<VerifyEmailResponseData>;
export type GoogleLoginResponse = ApiResponse<GoogleLoginResponseData>;
export type GoogleCompleteProfileResponse = ApiResponse<GoogleCompleteProfileResponseData>;
export type GetProductsResponse = ApiResponse<GetProductsResponseData>;
export type GetProductDetailResponse = ApiResponse<ProductDetail>;



