// gym.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Gym extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  pincode: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  country: string;

  @Prop([String])
  facilities?: string[];

  @Prop({
    type: {
      phone: String,
      email: String,
    },
  })
  contactInfo?: {
    phone: string;
    email: string;
  };
  
  @Prop({ type: String })
  image?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' }) // Assuming 'User' is the name of your user entity
  userId: Types.ObjectId; // Store the ID of the user who owns or created the gym
}

export const GymSchema = SchemaFactory.createForClass(Gym);

export type GymDocument = Gym & Document;
