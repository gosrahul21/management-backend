import { IsString, IsArray } from 'class-validator';

export class CreateGroupDto {
    @IsString()
    readonly groupName: string;

    @IsString()
    readonly gymId: string;

    @IsArray()
    readonly weekdays: string[];

    @IsString()
    readonly startTime: string;

    @IsString()
    readonly endTime: string;
}
