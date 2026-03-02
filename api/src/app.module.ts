import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { MetadataModule } from './metadata/metadata.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [AuthModule, FileModule, MetadataModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
