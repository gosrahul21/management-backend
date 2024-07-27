import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Gym } from 'src/modules/gym/entity/gym.entity';

@Schema({ timestamps: true })
export class GymEnquiry extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Types.ObjectId, ref: Gym.name, required: true })
  gymId: Types.ObjectId;

  createdAt?: Date;

  updatedAt?: Date;
}

export type GymEnquiryDocument = GymEnquiry & Document;

export const GymEnquirySchema = SchemaFactory.createForClass(GymEnquiry);
