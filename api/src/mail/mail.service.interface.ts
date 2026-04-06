import { Injectable } from '@nestjs/common';
import { Send2FACodeInputDto, Send2FACodeOutputDto } from './dto/mail.dto';

@Injectable()
export abstract class MailService {
  abstract send2FACode(input: Send2FACodeInputDto): Promise<Send2FACodeOutputDto>;
}