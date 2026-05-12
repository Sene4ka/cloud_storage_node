import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { MailService as MailServiceInterface } from './mail.service.interface';
import { Send2FACodeInputDto, Send2FACodeOutputDto } from './dto/mail.dto';

@Injectable()
export class ResendMailService implements MailServiceInterface {
  private readonly logger = new Logger(ResendMailService.name);
  private readonly resend: Resend;
  private readonly fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
    this.fromAddress = this.configService.getOrThrow<string>(
      'MAIL_FROM',
      'Cloud Storage <onboarding@resend.dev>'
    );

    this.logger.log('MailService initialized with Resend HTTP API');
  }

  async send2FACode(input: Send2FACodeInputDto): Promise<Send2FACodeOutputDto> {
    try {
      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Код подтверждения</h2>
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; padding: 30px; text-align: center; border-radius: 12px; 
                      font-size: 36px; font-weight: bold; letter-spacing: 6px; 
                      box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            ${input.code}
          </div>
          <p style="color: #666; margin-top: 20px;">Этот код действителен <strong>5 минут</strong>.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 14px;">Cloud Storage &bull; ${this.fromAddress}</p>
        </div>
      `;

      const textBody = `Ваш код 2FA: ${input.code} (действителен 5 минут)`;

      const { error } = await this.resend.emails.send({
        from: this.fromAddress,
        to: input.emailAddress,
        subject: 'Ваш код подтверждения Cloud Storage',
        text: textBody,
        html: htmlBody,
      });

      if (error) {
        this.logger.error(`Failed to send 2FA code: ${error.message}`);
        return {
          success: false,
          message: `Resend API error: ${error.message}`,
        };
      }

      this.logger.log(`2FA code sent to ${input.emailAddress}`);

      return {
        success: true,
        message: 'Код успешно отправлен',
      };
    } catch (error) {
      this.logger.error(`Failed to send 2FA code: ${error.message}`);

      return {
        success: false,
        message: `Mail error: ${error.message}`,
      };
    }
  }
}