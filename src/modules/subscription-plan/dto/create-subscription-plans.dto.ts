// create-subscription-plan.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class CreateSubscriptionPlanDto {
    @IsString()
    readonly planName: string;

    @IsString()
    readonly gymId: string;

    @IsNumber()
    readonly durationInDays: number;

    @IsNumber()
    readonly price: number;
}
