import {
  HealthResponse,
  DatabaseHealthResponse,
  RequestOtpResponse,
  VerifyOtpResponse,
  AuthUser,
  UserProfileResponse,
} from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    credentials: 'include', // Include HttpOnly cookies
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg =
      data?.message || data?.error || `Request failed with status ${res.status}`;
    throw new ApiError(
      Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg,
      res.status,
      data,
    );
  }

  return data as T;
}

export const api = {
  // Health
  async getHealth(): Promise<HealthResponse> {
    return request<HealthResponse>('/health', { cache: 'no-store' });
  },

  async getDatabaseHealth(): Promise<DatabaseHealthResponse> {
    return request<DatabaseHealthResponse>('/health/database', { cache: 'no-store' });
  },

  // Authentication
  async requestOtp(mobile: string, consentAccepted: boolean = true): Promise<RequestOtpResponse> {
    return request<RequestOtpResponse>('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, consentAccepted }),
    });
  },

  async verifyOtp(mobile: string, otp: string, name?: string): Promise<VerifyOtpResponse> {
    return request<VerifyOtpResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, otp, name }),
    });
  },

  async resendOtp(mobile: string): Promise<RequestOtpResponse> {
    return request<RequestOtpResponse>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });
  },

  async getMe(): Promise<{ success: boolean; user: AuthUser }> {
    return request<{ success: boolean; user: AuthUser }>('/auth/me', {
      cache: 'no-store',
    });
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    });
  },

  // User Profile
  async getProfile(): Promise<UserProfileResponse> {
    return request<UserProfileResponse>('/users/profile', {
      cache: 'no-store',
    });
  },

  async updateProfile(data: { name?: string; email?: string }): Promise<UserProfileResponse> {
    return request<UserProfileResponse>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Role Checks
  async checkMerchantAccess(): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/roles/merchant-check', {
      cache: 'no-store',
    });
  },

  async checkAdminAccess(): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/roles/admin-check', {
      cache: 'no-store',
    });
  },
};
