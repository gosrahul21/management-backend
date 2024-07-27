// employee.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Gym } from 'src/modules/gym/entity/gym.entity';
import { User } from 'src/modules/user/user.entity';

@Schema({ timestamps: true })
export class Employee extends Document {
  
  _id?: Types.ObjectId;
  
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: User.name,
  })
  userId: Types.ObjectId;

  @Prop({ required: true })
  role: string;

  @Prop({
    type: Types.ObjectId,
    ref: Gym.name,
    required: true,
  })
  gymId: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate?: Date;
}

export type EmployeeDocument = Employee & Document;

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
