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

export type ProfileResponse = ApiResponse<ProfileResponseData>;
export type RegisterResponse = ApiResponse<string>;
export type VerifyEmailResponse = ApiResponse<VerifyEmailResponseData>;
