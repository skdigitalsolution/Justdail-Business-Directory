import { RoleType, AccountStatus } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  mobile: string;
  name: string | null;
  email: string | null;
  accountStatus: AccountStatus;
  isMobileVerified: boolean;
  roles: RoleType[];
  permissions: string[];
  sessionId: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    mobile: string;
    name: string | null;
    email: string | null;
    accountStatus: AccountStatus;
    roles: RoleType[];
    permissions: string[];
  };
}
