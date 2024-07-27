import { Controller, Post, Body, Get, UseGuards, Param, Query } from '@nestjs/common';
import { GymEnquiryService } from '../gym-enquiries.service';
import { GymEnquiry } from '../entities/gym-enquiry.entity';
import { AuthGuard } from 'src/guard/user.guard';

@Controller('gym-enquiries')
export class GymEnquiryController {
  constructor(private readonly gymEnquiryService: GymEnquiryService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createEnquiry(@Body() enquiryData: Partial<GymEnquiry>) {
    return this.gymEnquiryService.createEnquiry(enquiryData);
  }

  @Get('/gym/:gymId')
  @UseGuards(AuthGuard)
  async getTotalEnquiries(@Param('gymId') gymId: string, @Query('from') from: string, @Query('to') to: string) {
    console.log(new Date(from), new Date(to))
    const totalEnquiries = await this.gymEnquiryService.getTotalEnquiries(
      gymId,
      from,
      to
    );
    return { totalEnquiries };
  }
}
