import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtAuthService } from '../jwt/jwt-auth.service';

export const IS_PUBLIC_KEY = 'isPublic';

@Injectable()
export class JwtAuthGuard {
  constructor(
      private readonly jwtAuthService: JwtAuthService,
      private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = this.getRequest(context); // ← заменить context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authorization header required');
    }

    try {
      request.user = await this.jwtAuthService.validateAccessToken(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private getRequest(context: ExecutionContext): any {
    if (context.getType<string>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req;
    }
    return context.switchToHttp().getRequest();
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}