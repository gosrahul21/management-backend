// member.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Gym } from 'src/modules/gym/entity/gym.entity';
import { Subscription } from 'src/modules/subscription/entity/subscription.entity';
import { User } from 'src/modules/user/user.entity';


@Schema({ timestamps: true })
export class Member extends Document {
  _id?: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: User.name,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Gym.name,
    required: true,
  })
  gymId: Types.ObjectId;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'Subscription',
  })
  activeSubscriptions: Subscription| Types.ObjectId;

  createdAt?: string;

  updatedAt?: string;
}

export type MemberDocument = Member & Document;

export const MemberSchema = SchemaFactory.createForClass(Member);

MemberSchema.index({ userId: 1, gymId: 1 }, { unique: true });

// a user can be subscribed to multiple subscribtion
// add subscribed in the array
