import { IsOptional, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
