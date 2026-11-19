export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  service: string;
  version: string;
}

export interface DatabaseHealthResponse {
  status: 'connected' | 'error';
  database: string;
  provider: 'mysql';
  latencyMs?: number;
  version?: string;
  timestamp: string;
  error?: string;
}

export type RoleType =
  | 'CONSUMER'
  | 'BUSINESS_OWNER'
  | 'MERCHANT_STAFF'
  | 'CONTENT_MODERATOR'
  | 'VERIFICATION_OFFICER'
  | 'SALES_SUPPORT_AGENT'
  | 'FINANCE_MANAGER'
  | 'SUPER_ADMIN';

export type UserRole = RoleType | 'VISITOR';

export type AccountStatus =
  | 'ACTIVE'
  | 'PENDING_VERIFICATION'
  | 'SUSPENDED'
  | 'DEACTIVATED';

export interface AuthUser {
  id: string;
  mobile: string;
  name: string | null;
  email: string | null;
  accountStatus: AccountStatus;
  isMobileVerified: boolean;
  roles: RoleType[];
  permissions: string[];
}

export interface RequestOtpResponse {
  success: boolean;
  message: string;
  cooldownSeconds: number;
  isDevelopment: boolean;
  devOtp?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  sessionToken?: string;
}

export interface UserProfileResponse {
  success: boolean;
  profile: AuthUser & {
    createdAt: string;
    updatedAt: string;
  };
}

export interface BusinessListing {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
  city: string;
  verified: boolean;
  phone?: string;
  image?: string;
}
