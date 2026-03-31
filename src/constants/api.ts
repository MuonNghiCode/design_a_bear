export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7002";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/Auth/login",
    LOGOUT: "/api/Auth/logout",
    PROFILE: "/api/Auth/profile",
    GET_PROFILE: "/api/Users/{userId}/profile",
    SIGNUP: "/api/Auth/signup",
    VERIFY_EMAIL: "/api/Auth/verify-email",
    GOOGLE_LOGIN: "/api/Auth/google-login",
    GOOGLE_COMPLETE_PROFILE: "/api/Auth/google-complete-profile",
  },
  USERS: {
    PROFILE: "/api/Users/profile",
    GET_ALL: "/api/Users",
    GET_BY_ID: "/api/Users",
    BLOCK: "/api/Users/{userId}/block",
    UNBLOCK: "/api/Users/{userId}/unblock",
  },
  ADDRESSES: {
    MY_ADDRESSES: "/api/Addresses/my-addresses",
    CREATE: "/api/Addresses",
    GET_BY_ID: "/api/Addresses/{id}",
    UPDATE: "/api/Addresses/{id}",
    DELETE: "/api/Addresses/{id}",
  },
  ORDERS: {
    FROM_CART: "/api/Orders/from-cart/{cartId}",
    GET_BY_USER: "/api/Orders/user/{userId}",
    GET_BY_ID: "/api/Orders/{orderId}",
    UPDATE_STATUS: "/api/Orders/{orderId}/status",
    GET_ALL: "/api/Orders",
  },
  PRODUCTS: {
    GET_ALL: "/api/Products",
    GET_BY_ID: "/api/Products",
    GET_BY_SLUG: "/api/Products/slug",
    CREATE: "/api/Products",
    UPDATE: "/api/Products",
    DELETE: "/api/Products",
  },
  REVIEWS: {
    CREATE: "/api/Reviews",
    UPDATE: "/api/Reviews/{id}",
    DELETE: "/api/Reviews/{id}",
    GET_BY_PRODUCT: "/api/Reviews/product/{productId}",
    GET_BY_USER: "/api/Reviews/user/{userId}",
    CAN_REVIEW: "/api/Reviews/product/{productId}/can-review",
    GET_AVERAGE: "/api/Reviews/product/{productId}/average",
  },
  CARTS: {
    BASE: "/api/Carts",
    ITEMS: "/api/Carts/items",
    ITEM: "/api/Carts/items",
    CLEAR: "/api/Carts",
  },
  PERSONALIZATION_RULES: {
    GET_ACTIVE: "/api/PersonalizationRules/product",
  },
  BUILDS: {
    BASE: "/api/Builds",
  },
  PROMOTIONS: {
    VALIDATE: "/api/Promotions/validate", // POST
  },
  PAYMENTS: {
    CREATE: "/api/Payments/create-payment", // POST
    CONFIRM: "/api/Payments/confirm-payment", // GET /api/Payments/confirm-payment/{orderCode}
  },
} as const;

export const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
} as const;

export const API_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
  LOADING: "loading",
} as const;

export const API_HEADERS = {
  CONTENT_TYPE: "Content-Type",
  AUTHORIZATION: "Authorization",
  ACCEPT: "Accept",
} as const;

export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: "Không thể kết nối tới máy chủ",
  UNAUTHORIZED: "Phiên đăng nhập đã hết hạn",
  FORBIDDEN: "Bạn không có quyền truy cập",
  NOT_FOUND: "Không tìm thấy tài nguyên",
  SERVER_ERROR: "Lỗi máy chủ nội bộ",
  VALIDATION_ERROR: "Dữ liệu nhập không hợp lệ",
} as const;
