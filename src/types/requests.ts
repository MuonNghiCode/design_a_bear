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
