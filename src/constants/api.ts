export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7002";

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
    PROFILE: "/api/Users/profile", // GET /api/Users/profile
  },
  ADDRESSES: {
    MY_ADDRESSES: "/api/Addresses/my-addresses", // GET
    CREATE: "/api/Addresses", // POST
  },
  ORDERS: {
    FROM_CART: "/api/Orders/from-cart/{cartId}", // POST /api/Orders/from-cart/{cartId}
  },
  PRODUCTS: {
    GET_ALL: "/api/Products",
    GET_BY_ID: "/api/Products",
    GET_BY_SLUG: "/api/Products/slug",
    CREATE: "/api/Products",
    UPDATE: "/api/Products",
    DELETE: "/api/Products",
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
