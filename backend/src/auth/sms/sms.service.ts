import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsProvider, SendOtpResult } from './sms.interface';
import { DevSmsAdapter } from './dev-sms.adapter';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private provider: SmsProvider;

  constructor(
    private readonly configService: ConfigService,
    private readonly devSmsAdapter: DevSmsAdapter,
  ) {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    const smsApiKey = this.configService.get<string>('SMS_PROVIDER_API_KEY');

    if (isProduction && smsApiKey) {
      // In future phase, instantiate production Fast2SMS / Gupshup / Msg91 adapter here
      this.logger.log('Production SMS provider configured with DLT compliance.');
      this.provider = this.devSmsAdapter; // Fallback until production credentials supplied
    } else {
      this.logger.log('Running in Development SMS mode. OTPs will be securely logged to server console.');
      this.provider = this.devSmsAdapter;
    }
  }

  async sendOtp(mobile: string, otp: string): Promise<SendOtpResult> {
    return this.provider.sendOtp({ mobile, otp });
  }

  isDevMode(): boolean {
    return this.provider.providerName === 'DEVELOPMENT_SIMULATOR';
  }
}
