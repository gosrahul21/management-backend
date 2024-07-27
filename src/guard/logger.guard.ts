import { Injectable } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces';
import { createInfoLog } from 'src/common/utils/logger';
@Injectable()
export class LoggerGuard {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    createInfoLog('request recieved', 'LoggerMiddleware', {
      headers: request.headers,
      payload: request.body,
    });
    return true;
  }
}
