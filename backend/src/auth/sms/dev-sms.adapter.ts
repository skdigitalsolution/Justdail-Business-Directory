import { Injectable, Logger } from '@nestjs/common';
import { SmsProvider, SendOtpOptions, SendOtpResult } from './sms.interface';

@Injectable()
export class DevSmsAdapter implements SmsProvider {
  private readonly logger = new Logger('DevSmsAdapter');
  public readonly providerName = 'DEVELOPMENT_SIMULATOR';

  // Indian DLT-registered dummy template ID for OTP
  private readonly DEFAULT_DLT_TEMPLATE_ID = '1007161829384950123';

  async sendOtp(options: SendOtpOptions): Promise<SendOtpResult> {
    const templateId = options.templateId || this.DEFAULT_DLT_TEMPLATE_ID;

    this.logger.warn(`========================================================`);
    this.logger.warn(`📱 [LOCAL DEVELOPMENT SMS ADAPTER - DLT SIMULATOR]`);
    this.logger.warn(`Recipient Mobile : ${options.mobile}`);
    this.logger.warn(`One-Time Password : >>> ${options.otp} <<<`);
    this.logger.warn(`DLT Template ID   : ${templateId}`);
    this.logger.warn(`Validity Duration : 10 minutes`);
    this.logger.warn(`Message Template  : Your verification code for Justdial Business Directory is ${options.otp}. Valid for 10 mins. Do not share with anyone.`);
    this.logger.warn(`⚠️  NOTE: Simulated local delivery. No real SMS gateway used.`);
    this.logger.warn(`========================================================`);

    return {
      success: true,
      messageId: `dev-msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      isDevelopment: true,
      deliveryStatus: 'SIMULATED_LOCAL_DEVELOPMENT',
    };
  }
}
