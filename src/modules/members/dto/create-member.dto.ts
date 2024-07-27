// member.schema.ts
import { IsBoolean, IsEmail, IsMongoId, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateMemberDto {
  @IsMongoId()
  @IsOptional()
  userId?: string;

  @IsMongoId()
  gymId: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

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
