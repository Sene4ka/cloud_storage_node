import {Resolver, Mutation, Args, Context, Query} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import {
    RegisterInputDto, RegisterCompleteInputDto,
    LoginInputDto, LoginCompleteInputDto,
    RefreshInputDto, LogoutInputDto,
    Enable2FAInputDto, Enable2FACompleteInputDto,
    ChangeEmailInputDto, ChangeEmailCompleteInputDto,
    ChangePasswordInputDto, ChangePasswordCompleteInputDto,
    ChangeMetaInputDto, ValidateTokenInputDto,
} from './dto/auth.input.dto';
import {
    RegisterType, AuthTokensType, LoginType, RefreshType,
    LogoutType, MessageType, Enable2FACompleteType,
    ChangeEmailType, ChangeMetaType, ValidateTokenType,
} from './models/auth.model';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => RegisterType)
    async register(@Args('input') input: RegisterInputDto) {
        return this.authService.register(input);
    }

    @Mutation(() => AuthTokensType)
    async registerComplete(@Args('input') input: RegisterCompleteInputDto) {
        return this.authService.registerComplete(input);
    }

    @Mutation(() => LoginType)
    async login(@Args('input') input: LoginInputDto) {
        return this.authService.login(input);
    }

    @Mutation(() => AuthTokensType)
    async loginComplete(@Args('input') input: LoginCompleteInputDto) {
        return this.authService.loginComplete(input);
    }

    @Mutation(() => RefreshType)
    async refresh(@Args('input') input: RefreshInputDto) {
        return this.authService.refresh(input);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => LogoutType)
    async logout(@Args('input') input: LogoutInputDto) {
        return this.authService.logout(input);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => MessageType)
    async enable2FA(@Args('input') input: Enable2FAInputDto, @Context() ctx) {
        return this.authService.enable2FA(input, ctx.req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Enable2FACompleteType)
    async enable2FAComplete(@Args('input') input: Enable2FACompleteInputDto, @Context() ctx) {
        return this.authService.enable2FAComplete(input, ctx.req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => MessageType)
    async disable2FA(@Args('input') input: Enable2FAInputDto, @Context() ctx) {
        return this.authService.disable2FA(input, ctx.req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Enable2FACompleteType)
    async disable2FAComplete(@Args('input') input: Enable2FACompleteInputDto, @Context() ctx) {
        return this.authService.disable2FAComplete(input, ctx.req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => MessageType)
    async changeEmail(@Args('input') input: ChangeEmailInputDto, @Context() ctx) {
        return this.authService.changeEmail(input, ctx.req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => ChangeEmailType)
    async changeEmailComplete(@Args('input') input: ChangeEmailCompleteInputDto, @Context() ctx) {
        return this.authService.changeEmailComplete(input, ctx.req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => MessageType)
    async changePassword(@Args('input') input: ChangePasswordInputDto, @Context() ctx) {
        return this.authService.changePassword(input, ctx.req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => MessageType)
    async changePasswordComplete(@Args('input') input: ChangePasswordCompleteInputDto, @Context() ctx) {
        return this.authService.changePasswordComplete(input, ctx.req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => ChangeMetaType)
    async changeMeta(@Args('input') input: ChangeMetaInputDto, @Context() ctx) {
        return this.authService.changeMeta(input, ctx.req.user.userId);
    }

    @Query(() => ValidateTokenType)
    async validateToken(@Args('input') input: ValidateTokenInputDto) {
        return this.authService.validateToken(input);
    }
}