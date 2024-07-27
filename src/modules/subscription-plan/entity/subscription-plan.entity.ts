// subscription-plan.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Gym } from 'src/modules/gym/entity/gym.entity';

@Schema({ timestamps: true })
export class SubscriptionPlan extends Document {
    @Prop({ required: true })
    planName: string; // Name of the subscription plan

    @Prop({ type: Types.ObjectId, ref: Gym.name, required: true })
    gymId: Types.ObjectId | Gym; // Store the ID of the gym to which the subscription plan belongs

    @Prop({ required: true })
    durationInDays: number; // Duration of the subscription plan in months

    @Prop({ required: true })
    price: number; // Price of the subscription plan
}

export const SubscriptionPlanSchema = SchemaFactory.createForClass(SubscriptionPlan);
