export * from "./api";

export const APP_CONFIG = {
  NAME: "Design a Bear",
  VERSION: "1.0.0",
  DESCRIPTION: "Design a Bear System",
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  CART_ID: 'cart_id',
  PENDING_PAYMENT_ORDER: 'pending_payment_order',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_RATING: 1,
  MAX_RATING: 5,
} as const;
