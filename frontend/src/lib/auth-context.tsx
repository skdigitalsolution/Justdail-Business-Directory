'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser, RoleType } from '@/types';
import { api } from './api';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  primaryRole: RoleType | 'VISITOR';
  dashboardRoute: string;
  hasRole: (role: RoleType) => boolean;
  hasAnyRole: (roles: RoleType[]) => boolean;
  hasPermission: (permission: string) => boolean;
  setUserSession: (user: AuthUser) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function getDashboardRoute(roles: RoleType[]): string {
  if (
    roles.includes('SUPER_ADMIN') ||
    roles.includes('CONTENT_MODERATOR') ||
    roles.includes('VERIFICATION_OFFICER') ||
    roles.includes('SALES_SUPPORT_AGENT') ||
    roles.includes('FINANCE_MANAGER')
  ) {
    return '/admin/dashboard';
  }
  if (roles.includes('BUSINESS_OWNER') || roles.includes('MERCHANT_STAFF')) {
    return '/merchant/dashboard';
  }
  return '/customer/dashboard';
}

export function getPrimaryRole(roles: RoleType[]): RoleType | 'VISITOR' {
  if (!roles || roles.length === 0) return 'VISITOR';
  if (roles.includes('SUPER_ADMIN')) return 'SUPER_ADMIN';
  if (roles.includes('FINANCE_MANAGER')) return 'FINANCE_MANAGER';
  if (roles.includes('VERIFICATION_OFFICER')) return 'VERIFICATION_OFFICER';
  if (roles.includes('CONTENT_MODERATOR')) return 'CONTENT_MODERATOR';
  if (roles.includes('SALES_SUPPORT_AGENT')) return 'SALES_SUPPORT_AGENT';
  if (roles.includes('BUSINESS_OWNER')) return 'BUSINESS_OWNER';
  if (roles.includes('MERCHANT_STAFF')) return 'MERCHANT_STAFF';
  return 'CONSUMER';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const setUserSession = (authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Proceed with clearing local state even if server fails
    } finally {
      setUser(null);
      router.push('/');
    }
  };

  const hasRole = (role: RoleType): boolean => {
    if (!user) return false;
    if (user.roles.includes('SUPER_ADMIN')) return true;
    return user.roles.includes(role);
  };

  const hasAnyRole = (roles: RoleType[]): boolean => {
    if (!user) return false;
    if (user.roles.includes('SUPER_ADMIN')) return true;
    return roles.some((r) => user.roles.includes(r));
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.roles.includes('SUPER_ADMIN') || user.permissions.includes('admin:all')) return true;
    return user.permissions.includes(permission);
  };

  const roles = user?.roles || [];
  const primaryRole = getPrimaryRole(roles);
  const dashboardRoute = getDashboardRoute(roles);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        primaryRole,
        dashboardRoute,
        hasRole,
        hasAnyRole,
        hasPermission,
        setUserSession,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
