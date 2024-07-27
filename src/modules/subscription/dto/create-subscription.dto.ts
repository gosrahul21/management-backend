import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateSubscriptionDto {
    @IsString()
    readonly memberId: string;

    @IsOptional()
    @IsString()
    readonly planId?: string;

    @IsOptional()
    @IsString()
    readonly groupId?: string;

    @IsDateString()
    readonly startDate: Date;

}
