import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';


export class UserInput {
  @IsNotEmpty()
  @IsMongoId()
  googleId: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  // @IsOptional()
  // @IsEmail()
  // appId?: Types.ObjectId;

  @IsOptional()
  @IsEmail()
  userId?: Types.ObjectId;

  // @IsNotEmpty()
  // @IsString()
  // pin: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  image?: string;

  // publicKey: string;
}
