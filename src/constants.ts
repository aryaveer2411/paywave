export const DB_NAME = 'paywave';
export const BASE_URL = 'http://localhost:';

export const Roles = {
  ADMIN: 'admin',
  MERCHANT: 'merchant',
  CUSTOMER: 'customer',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
