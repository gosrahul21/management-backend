import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { SubscriptionService } from '../service/subscription.service';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { AuthGuard } from 'src/guard/user.guard';
import { UpdateSubscriptionDto } from '../dto/update-subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Request() req,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    const userId = req.decoded.userId;
    return this.subscriptionService.createSubscription(
      userId,
      createSubscriptionDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() req) {
    const userId = req.decoded.userId;
    return this.subscriptionService.getAllSubscriptions(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.decoded.userId;
    return this.subscriptionService.getSubscriptionById(userId, id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    const userId = req.decoded.userId;
    return this.subscriptionService.updateSubscription(
      userId,
      id,
      updateSubscriptionDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.decoded.userId;
    await this.subscriptionService.deleteSubscription(userId, id);
    return { message: 'Subscription deleted successfully' };
  }

  @Get('revenue/gym/:gymId')
  @UseGuards(AuthGuard)
  async getRevenue(
    @Param('gymId') gymId: string,
    @Query('fromDate') from: string,
    @Query('toDate') to: string,
  ) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const revenue = await this.subscriptionService.getRevenue(
      gymId,
      fromDate,
      toDate,
    );
    return {
      revenue,
    };
  }
}
