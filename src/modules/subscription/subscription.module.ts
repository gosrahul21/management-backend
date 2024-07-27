import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from './entity/subscription.entity';
import { SubscriptionController } from './controllers/subscription.controller';
import { SubscriptionService } from './service/subscription.service';
import { JwtModule } from '@nestjs/jwt';
import { SubscriptionPlanModule } from '../subscription-plan/subscription-plan.module';
import { MemberModule } from '../members/memebers.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Subscription.name, schema: SubscriptionSchema },
        ]),
        JwtModule,
        SubscriptionPlanModule,
        MemberModule
    ],
    controllers: [SubscriptionController],
    providers: [SubscriptionService],
})
export class SubscriptionModule {}
