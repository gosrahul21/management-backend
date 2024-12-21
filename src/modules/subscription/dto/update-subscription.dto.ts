import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionDto } from './create-subscription.dto';
import { IsArray, IsDate, IsOptional, ValidateNested } from 'class-validator';
import {Type} from 'class-transformer';
class HoldPeriodDto {
  @IsDate()
  @Type(() => Date)
  pauseDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  restartDate?: Date;
}

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HoldPeriodDto)
  holdDate?: HoldPeriodDto[];
}
