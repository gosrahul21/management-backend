import { PartialType } from '@nestjs/mapped-types';
import { UserInput } from './user.input';

export class UpdateUserDto extends PartialType(UserInput) {}
