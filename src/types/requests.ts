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

export interface GetProductsRequest {
    pageIndex?: number;
    pageSize?: number;
    productType?: string;
    sortBy?: string;
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
