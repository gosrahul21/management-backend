import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GymEnquiryController } from './controllers/gym-enquiries.controller';
import { GymEnquiry, GymEnquirySchema } from './entities/gym-enquiry.entity';
import { GymEnquiryService } from './gym-enquiries.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GymEnquiry.name, schema: GymEnquirySchema }]),
    JwtModule,
    UserModule,
  ],
  controllers: [GymEnquiryController],
  providers: [GymEnquiryService]
})
export class GymEnquiryModule {}
