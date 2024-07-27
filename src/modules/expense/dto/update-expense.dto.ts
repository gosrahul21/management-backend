import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateExpenseDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  date?: Date;

}