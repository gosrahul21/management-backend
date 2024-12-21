// subscription.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Group } from 'src/modules/group/entities/group.entity';
import { Member } from 'src/modules/members/entity/member.entity';
import { SubscriptionPlan } from 'src/modules/subscription-plan/entity/subscription-plan.entity';
import { SubscriptionStatus } from 'src/types/susbcription-status.enum';

@Schema({ timestamps: true })
export class Subscription extends Document {
  _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Member.name, required: true })
  memberId: string; // Store the ID of the user who subscribed to the plan

  @Prop({ type: Types.ObjectId, ref: SubscriptionPlan.name })
  planId?: SubscriptionPlan | Types.ObjectId; // Store the ID of the subscription plan

  @Prop({
    type: Types.ObjectId,
    ref: Group.name,
  })
  groupId?: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date; // Start date of the subscription

  @Prop({
    type: [
      {
        pauseDate: { type: Date },
        restartDate: { type: Date },
      },
    ],
    required: false,
  })
  holdDate?: {
    pauseDate: Date;
    restartDate?: Date;
  }[];

  @Prop({
    type: String,
    default: SubscriptionStatus.ACTIVE,
    enum: SubscriptionStatus,
  })
  status: SubscriptionStatus;

  remainingDays?: number;

  createdAt?: Date;

  updatedAt?: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

// Add middleware to calculate remainingDays
SubscriptionSchema.post('find', async function (subscriptions) {
  for (const subscription of subscriptions) {
    await getRemainingAndElapesedDays(subscription);
  }
});

SubscriptionSchema.post('findOne', async function (subscription) {
  if (subscription) {
    await getRemainingAndElapesedDays(subscription);
  }
});

function getRemainingAndElapesedDays(subscription: Subscription) {
  const subscriptionPlan = subscription.planId as SubscriptionPlan;
  const totalDuration = subscriptionPlan.durationInDays;
  const startDate = new Date(subscription.startDate);
  const currentDate = new Date();

  // Calculate hold duration in days
  const holdDuration =
    subscription.holdDate?.reduce((total, holdPeriod) => {
      const pauseDate = new Date(holdPeriod.pauseDate);
      if (pauseDate > currentDate) return total;
      const restartDate =
        holdPeriod.restartDate && holdPeriod.restartDate < currentDate
          ? new Date(holdPeriod.restartDate)
          : currentDate;
      return (
        total +
        (restartDate.getTime() - pauseDate.getTime()) / (1000 * 60 * 60 * 24)
      );
    }, 0) || 0;

  // Calculate remaining days
  const elapsedDays =
    (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24) - holdDuration;
  const remainingDays = Math.max(0, totalDuration - Math.floor(elapsedDays));

  //   return { remainingDays, elapsedDays, holdDuration };
  subscription.remainingDays = remainingDays;
}
