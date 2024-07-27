import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateGymDto {
  @IsString()
  _id: string;
  
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  pincode?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsArray()
  @IsOptional()
  facilities?: string[];

  @IsObject()
  @IsOptional()
  contactInfo?: {
    phone: string;
    email: string;
  };
}
