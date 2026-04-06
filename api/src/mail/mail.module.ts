import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { MockMailService } from './mock-mail.service';
import { MailService as MailServiceInterface } from './mail.service.interface';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MailServiceInterface,
      useFactory: (configService: ConfigService) => {
        const isMock = process.env.NODE_ENV === 'test' || process.env.MAIL_MOCK === 'true';
        return isMock ? new MockMailService() : new MailService(configService);
      },
      inject: [ConfigService],
    },
    MailService,
    MockMailService,
  ],
  exports: [MailServiceInterface],
})
export class MailModule {}