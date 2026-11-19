import { UserRole } from '@/types';

export interface AuthSession {
  user: {
    id: string;
    phone: string;
    name?: string;
    role: UserRole;
  } | null;
  isAuthenticated: boolean;
}

export const INITIAL_AUTH_STATE: AuthSession = {
  user: null,
  isAuthenticated: false,
};

export function canAccessDashboard(role: UserRole, target: 'customer' | 'merchant' | 'admin'): boolean {
  if (role === 'SUPER_ADMIN') return true;

  switch (target) {
    case 'customer':
      return role === 'CONSUMER';
    case 'merchant':
      return role === 'BUSINESS_OWNER' || role === 'MERCHANT_STAFF';
    case 'admin':
      return [
        'CONTENT_MODERATOR',
        'VERIFICATION_OFFICER',
        'SALES_SUPPORT_AGENT',
        'FINANCE_MANAGER',
      ].includes(role);
    default:
      return false;
  }
}
