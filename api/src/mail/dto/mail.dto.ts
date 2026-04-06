export class Send2FACodeInputDto {
  emailAddress: string;
  code: string;
}

export class Send2FACodeOutputDto {
  success: boolean;
  message: string;
}