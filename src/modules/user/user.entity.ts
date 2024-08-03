import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id?: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    required: false,
    unique: true,
  })
  phoneNo?: string;

  @Prop({ required: false }) // false on google signin
  password?: string;

  @Prop({
    unique: true,
    required: false,
  })
  googleId?: string;

  @Prop({
    required: true,
  })
  firstName: string;

  @Prop({
    required: false,
  })
  lastName: string;

  @Prop({
    // required: true,
    enum: ['male', 'female', 'other'],
  })
  gender?: string;

  @Prop({
    required: false,
  })
  image?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
