// gym.dto.ts
import { IsString, IsNotEmpty, IsArray, IsOptional, IsObject } from 'class-validator';

export class CreateGymDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  pincode: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsArray()
  @IsOptional()
  facilities?: string[];

  @IsObject()
  @IsOptional()
  contactInfo?: {
    phone: string;
    email: string;
  };

  // userId: string;
}

