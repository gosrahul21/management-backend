import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export function throwErrorMessage(error: {
  index: number;
  code: number;
  keyPattern: Record<string, number>;
  keyValue: Record<string, string>;
  message: string;
}) {
  // throw valid error for dublicate key
  if (error.code === 11000) {
    const firstKey = Object.keys(error.keyValue)[0];
    throw new BadRequestException(
      `${firstKey} '${error.keyValue[firstKey]}' ${this.i18nService.t(
        'default.ALREADY_EXIST',
      )}`,
    );
  }
  throw new InternalServerErrorException(error.message);
}
