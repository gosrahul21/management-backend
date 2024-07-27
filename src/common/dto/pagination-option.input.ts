// import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PaginationOptionInput {
  @IsString()
  @IsOptional()
  search?: string;

  @IsInt()
  @IsPositive({
    message: i18nValidationMessage('validation.POSITIVE_NUMBER_REQUIRED'),
  })
  pageNo: number;

  @IsInt()
  @IsPositive({
    message: i18nValidationMessage('validation.POSITIVE_NUMBER_REQUIRED'),
  })
  limit: number;
}
