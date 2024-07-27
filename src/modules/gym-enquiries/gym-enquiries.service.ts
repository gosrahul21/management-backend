import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GymEnquiry, GymEnquiryDocument } from './entities/gym-enquiry.entity';

@Injectable()
export class GymEnquiryService {
  constructor(
    @InjectModel(GymEnquiry.name)
    private gymEnquiryModel: Model<GymEnquiryDocument>,
  ) {}

  async createEnquiry(enquiryData: Partial<GymEnquiry>): Promise<GymEnquiry> {
    const newEnquiry = new this.gymEnquiryModel(enquiryData);
    return newEnquiry.save();
  }

  async getTotalEnquiries(
    gymId: string,
    from: string,
    to: string,
  ): Promise<number> {
    const enquiries = await this.gymEnquiryModel
      .find({
        createdAt: { $gte: from, $lte: to },
        gymId,
      })
      .countDocuments();
    return enquiries;
  }
}
