import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GymModule } from './modules/gym/gym.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { SubscriptionPlanModule } from './modules/subscription-plan/subscription-plan.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { UserModule } from './modules/user/user.module';
import * as path from 'path';
import { I18nModule } from 'nestjs-i18n';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoUrl } from './common/utils/getMongoUrl';
import { ConfigModule } from '@nestjs/config';
import { GroupModule } from './modules/group/group.module';
import { MemberModule } from './modules/members/memebers.module';
import { ImageModule } from './modules/image/image.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { GymEnquiryModule } from './modules/gym-enquiries/gym-enquiries.module';

@Module({
  imports: [
    GymModule,
    EmployeeModule,
    ConfigModule.forRoot(),
    SubscriptionPlanModule,
    MongooseModule.forRoot(getMongoUrl()),
    SubscriptionModule,
    GroupModule,
    MemberModule,
    ExpenseModule,
    UserModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/translation/'),
        watch: true,
      },
    }),
    ImageModule,
    ExpenseModule,
    GymEnquiryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
