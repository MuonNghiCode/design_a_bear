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
