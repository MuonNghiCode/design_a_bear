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