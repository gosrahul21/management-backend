import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Expense extends Document {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Gym', required: true })
  gymId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string; // The user who added the expense

  createdAt: Date;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
