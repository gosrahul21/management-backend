import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Gym } from 'src/modules/gym/entity/gym.entity';

@Schema({ timestamps: true })
export class Group extends Document {
    @Prop({ required: true })
    groupName: string;

    @Prop({ type: Types.ObjectId, ref: Gym.name, required: true })
    gymId: string;

    @Prop({ required: true })
    weekdays: string[]; // Array of weekdays, e.g., ['Monday', 'Wednesday', 'Friday']

    @Prop({ required: true })
    startTime: string; // e.g., '08:00 AM'

    @Prop({ required: true })
    endTime: string; // e.g., '09:00 AM'
}

export const GroupSchema = SchemaFactory.createForClass(Group);
