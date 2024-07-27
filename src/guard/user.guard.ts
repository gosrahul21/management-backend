import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(I18nService) private i18nService: I18nService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token =
      request.headers['x-access-token'] || request.headers['authorization'];
      console.log(token)
    if (token == null) {
      throw new UnauthorizedException(
        this.i18nService.t('default.GUARD_TOKEN_REQUIRED'),
      );
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    // console.log(process.env.SECRET_KEY)
      try {
        const result = this.jwtService.verify(token, {
          secret: process.env.SECRET_KEY,
        });
        console.log(result)
        request.decoded = result;
        return true;
      } catch (error) {
        throw new UnauthorizedException(
          this.i18nService.t('default.GUARD_TOKEN_INVALID'),
        );
      }
  }
}
