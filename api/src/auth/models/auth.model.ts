import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RegisterType {
    @Field() userId: string;
    @Field() email: string;
    @Field() name: string;
    @Field() message: string;
}

@ObjectType()
export class AuthTokensType {
    @Field() userId: string;
    @Field() email: string;
    @Field() name: string;
    @Field() accessToken: string;
    @Field(() => Int) accessExpiresIn: number;
    @Field() refreshToken: string;
    @Field(() => Int) refreshExpiresIn: number;
}

@ObjectType()
export class LoginType {
    @Field() userId: string;
    @Field() email: string;
    @Field() name: string;
    @Field({ nullable: true }) accessToken?: string;
    @Field(() => Int, { nullable: true }) accessExpiresIn?: number;
    @Field({ nullable: true }) refreshToken?: string;
    @Field(() => Int, { nullable: true }) refreshExpiresIn?: number;
    @Field({ nullable: true }) tempToken?: string;
    @Field() requires2FA: boolean;
    @Field() message: string;
}

@ObjectType()
export class RefreshType {
    @Field() accessToken: string;
    @Field(() => Int) accessExpiresIn: number;
    @Field() refreshToken: string;
    @Field(() => Int) refreshExpiresIn: number;
}

@ObjectType()
export class LogoutType {
    @Field() success: boolean;
}

@ObjectType()
export class MessageType {
    @Field() message: string;
}

@ObjectType()
export class Enable2FACompleteType {
    @Field() is2FAEnabled: boolean;
    @Field() message: string;
}

@ObjectType()
export class ChangeEmailType {
    @Field() email: string;
    @Field() message: string;
}

@ObjectType()
export class ChangeMetaType {
    @Field() userId: string;
    @Field() name: string;
    @Field() message: string;
}

@ObjectType()
export class ValidateTokenType {
    @Field() valid: boolean;
    @Field({ nullable: true }) userId?: string;
    @Field({ nullable: true }) name?: string;
    @Field({ nullable: true }) email?: string;
    @Field(() => Int, { nullable: true }) expiresIn?: number;
    @Field({ nullable: true }) is2FAEnabled?: boolean;
}