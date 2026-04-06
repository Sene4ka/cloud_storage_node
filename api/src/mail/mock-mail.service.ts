import { Injectable, Logger } from '@nestjs/common';
import { MailService as MailServiceInterface } from './mail.service.interface';
import { Send2FACodeInputDto, Send2FACodeOutputDto } from './dto/mail.dto';

@Injectable()
export class MockMailService implements MailServiceInterface {
  private readonly logger = new Logger(MockMailService.name);

  async send2FACode(input: Send2FACodeInputDto): Promise<Send2FACodeOutputDto> {
    this.logger.log(`[MOCK] 2FA code ${input.code} sent to ${input.emailAddress}`);

    return {
      success: true,
      message: '[MOCK] Код успешно отправлен',
    };
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string,
  ): Promise<boolean> {
    this.logger.log(`[MOCK] Email sent to ${to}: ${subject}`);
    return true;
  }
}