import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class HoldSubscriptionDto {
   
    @IsDateString()
    readonly pauseDate: Date;

    @IsDateString()
    readonly restartDate: Date;

}
