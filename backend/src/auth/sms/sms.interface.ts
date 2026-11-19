export interface SendOtpOptions {
  mobile: string;
  otp: string;
  templateId?: string;
}

export interface SendOtpResult {
  success: boolean;
  messageId?: string;
  isDevelopment: boolean;
  deliveryStatus: string;
}

export interface SmsProvider {
  readonly providerName: string;
  sendOtp(options: SendOtpOptions): Promise<SendOtpResult>;
}
