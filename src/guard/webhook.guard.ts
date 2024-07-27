import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class WebhookGuard {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { secretkey } = request.headers;
    if (!secretkey) return false;
    if (secretkey === process.env.SUMSUB_SECRET_KEY) {
      request.authkey = secretkey;
      return true;
    }
    return false;
  }
}
