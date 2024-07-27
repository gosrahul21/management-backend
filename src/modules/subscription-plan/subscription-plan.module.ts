// tested - ok
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionPlan, SubscriptionPlanSchema } from './entity/subscription-plan.entity';
import { GymModule } from '../gym/gym.module';
import { SubscriptionPlanService } from './service/subscription-plan.service';
import { JwtModule } from '@nestjs/jwt';
import { SubscriptionPlanController } from './controllers/subscription-plan.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
        ]),
        GymModule,
        JwtModule,
    ],
    controllers: [SubscriptionPlanController],
    providers: [SubscriptionPlanService],
    exports:[SubscriptionPlanService]
})
export class SubscriptionPlanModule {}
