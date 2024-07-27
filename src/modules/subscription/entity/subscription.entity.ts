// subscription.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Group } from 'src/modules/group/entities/group.entity';
import { Member } from 'src/modules/members/entity/member.entity';
import { SubscriptionPlan } from 'src/modules/subscription-plan/entity/subscription-plan.entity';

@Schema({ timestamps: true })
export class Subscription extends Document {

    _id?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Member.name, required: true })
    memberId: string; // Store the ID of the user who subscribed to the plan

    @Prop({ type: Types.ObjectId, ref: SubscriptionPlan.name, })
    planId?: SubscriptionPlan | Types.ObjectId; // Store the ID of the subscription plan

    @Prop({
        type:Types.ObjectId,
        ref: Group.name,
    })
    groupId?: Types.ObjectId;

    @Prop({ required: true })
    startDate: Date; // Start date of the subscription

    createdAt?: Date;

    updatedAt?: Date;

}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
