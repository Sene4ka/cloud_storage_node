import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailService as MailServiceInterface } from './mail.service.interface';
import { Send2FACodeInputDto, Send2FACodeOutputDto } from './dto/mail.dto';

@Injectable()
export class MailService implements MailServiceInterface {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    this.fromAddress = this.configService.getOrThrow<string>('SMTP_EMAIL_ADDRESS');

    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USERNAME'),
        pass: this.configService.getOrThrow<string>('SMTP_PASSWORD'),
      },
    });

    this.verifyTransport();
  }

  private async verifyTransport(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection verified successfully');
    } catch (error) {
      this.logger.error(`SMTP connection failed: ${error.message}`);
    }
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

      await this.transporter.sendMail({
        from: this.fromAddress,
        to: input.emailAddress,
        subject: 'Ваш код подтверждения Cloud Storage',
        text: textBody,
        html: htmlBody,
      });

      this.logger.log(`2FA code sent to ${input.emailAddress}`);

      return {
        success: true,
        message: 'Код успешно отправлен',
      };
    } catch (error) {
      this.logger.error(`Failed to send 2FA code: ${error.message}`);

      return {
        success: false,
        message: `SMTP Error: ${error.message}`,
      };
    }
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string,
  ): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject,
        html,
        text: text || subject,
      });

      this.logger.log(`Email sent to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      return false;
    }
  }
}