import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SmtpMailService } from './smtp.mail.service';
import { ResendMailService } from './resend.mail.service';
import { MailService as MailServiceInterface } from './mail.service.interface';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MailServiceInterface,
      useFactory: (configService: ConfigService) => {
        const provider = configService.get<string>('MAIL_PROVIDER', 'smtp');
        return provider === 'resend'
          ? new ResendMailService(configService)
          : new SmtpMailService(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [MailServiceInterface],
})
export class MailModule {}