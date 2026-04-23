export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

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
    CANCEL: "/api/Orders/{orderId}/cancel",
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
  CATEGORIES: {
    GET_ALL: "/api/Categories",
    GET_BY_ID: "/api/Categories/{id}",
    CREATE: "/api/Categories",
    UPDATE: "/api/Categories/{id}",
    DELETE: "/api/Categories/{id}",
  },
  CHARACTERS: {
    GET_ALL: "/api/Characters",
    GET_BY_ID: "/api/Characters/{id}",
    CREATE: "/api/Characters",
    UPDATE: "/api/Characters/{id}",
    DELETE: "/api/Characters/{id}",
    GET_ALL_WITH_ACCESSORIES: "/api/Characters/all-with-accessories",
    GET_BY_SLUG: "/api/Characters/slug/{slug}",
  },
  REVIEWS: {
    CREATE: "/api/Reviews",
    UPDATE: "/api/Reviews/{id}",
    DELETE: "/api/Reviews/{id}",
    GET_ALL: "/api/Reviews/all",
    GET_BY_PRODUCT: "/api/Reviews/product/{productId}",
    GET_BY_USER: "/api/Reviews/user/{userId}",
    GET_REPLIES: "/api/Reviews/{id}/replies",
    CAN_REVIEW: "/api/Reviews/product/{productId}/can-review",
    GET_AVERAGE: "/api/Reviews/product/{productId}/average",
    APPROVE: "/api/Reviews/{id}/approve",
    REJECT: "/api/Reviews/{id}/reject",
    REPLY: "/api/Reviews/{id}/reply",
    UPDATE_REPLY: "/api/Reviews/replies/{replyId}",
  },
  CARTS: {
    BASE: "/api/Carts",
    ITEMS: "/api/Carts/items",
    ITEM: "/api/Carts/items",
    CLEAR: "/api/Carts",
  },
  PERSONALIZATION_RULES: {
    BASE: "/api/PersonalizationRules",
    BY_ID: "/api/PersonalizationRules/{id}",
    GET_ACTIVE: "/api/PersonalizationRules/product",
  },
  PERSONALIZATION_GROUPS: {
    BASE: "/api/PersonalizationGroups",
    BY_ID: "/api/PersonalizationGroups/{id}",
  },
  BUILDS: {
    BASE: "/api/Builds",
  },
  PROMOTIONS: {
    GET_ALL: "/api/Promotions",
    GET_ACTIVE: "/api/Promotions/active",
    GET_BY_ID: "/api/Promotions",
    GET_BY_CODE: "/api/Promotions/code",
    CREATE: "/api/Promotions",
    UPDATE: "/api/Promotions",
    DELETE: "/api/Promotions",
    VALIDATE: "/api/Promotions/validate",
    APPLY: "/api/Promotions/apply",
  },
  PAYMENTS: {
    CREATE: "/api/Payments/create-payment", // POST
    CONFIRM: "/api/Payments/confirm-payment", // GET /api/Payments/confirm-payment/{orderCode}
  },
  MEDIA: {
    UPLOAD: "/api/media/upload",
  },
  REPORTS: {
    REVENUE: "/api/Reports/revenue",
  },
  PRODUCT_ISSUE_REPORTS: {
    BASE: "/api/ProductIssueReports",
    GET_BY_ID: "/api/ProductIssueReports/{id}",
    MY_REPORTS: "/api/ProductIssueReports/my",
    BY_STATUS: "/api/ProductIssueReports/status/{status}",
    ASSIGN: "/api/ProductIssueReports/{id}/assign",
    RESOLVE: "/api/ProductIssueReports/{id}/resolve",
    COMPLETE: "/api/ProductIssueReports/{id}/complete",
    REJECT: "/api/ProductIssueReports/{id}/reject",
  },
  SHIPPING: {
    CALCULATE_FEE: "/api/Shipping/calculate-fee",
  },
  INVENTORIES: {
    BASE: "/api/Inventories",
    BY_PRODUCT: "/api/Inventories/product/{productId}",
    TOTAL: "/api/Inventories/total",
    ADJUST: "/api/Inventories/adjust",
    RESERVE: "/api/Inventories/reserve",
    RELEASE: "/api/Inventories/release",
    // Note: Legacy endpoints kept for compatibility if needed, 
    // but preference is the unified /total and /adjust endpoints.
    VARIANT_ADJUST: "/api/Inventories/variant/adjust",
    ACCESSORY_ADJUST: "/api/Inventories/accessory/adjust",
    BY_ACCESSORY: "/api/Inventories/accessory/{accessoryId}",
    BY_LOCATION_PRODUCT:
      "/api/Inventories/location/{locationId}/product/{productId}",
  },
  LOCATIONS: {
    BASE: "/api/Locations",
    BY_ID: "/api/Locations/{id}",
  },
  ACCESSORIES: {
    GET_ALL: "/api/Accessories",
    GET_BY_ID: "/api/Accessories/{id}",
    GET_BY_PRODUCT: "/api/Accessories/product/{productId}",
    SMART_CHIP: "/api/Accessories/smart-chip",
    CREATE: "/api/Accessories",
    UPDATE: "/api/Accessories/{id}",
    DELETE: "/api/Accessories/{id}",
    ADD_TO_PRODUCT: "/api/Accessories/matrix",
    REMOVE_FROM_PRODUCT: "/api/Accessories/matrix",
  },
  FAVORITES: {
    BASE: "/api/Favorites",
    TOGGLE: "/api/Favorites/toggle",
  },
  PRODUCTION_JOBS: {
    BASE: "/api/ProductionJobs",
    LOBBY: "/api/ProductionJobs/lobby",
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
