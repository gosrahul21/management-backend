import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsOptional()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsString()
  gymId: string;

  @IsDateString()
  @IsOptional()
  startDate: Date = new Date();

  @IsDateString()
  @IsOptional()
  endDate?: Date;

  // optional parameters if user don't exist

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNo?: string;

  @IsString()
  name?: string;

  @IsString()
  gender: string;

  @IsString()
  @IsOptional()
  image?: string;
}
