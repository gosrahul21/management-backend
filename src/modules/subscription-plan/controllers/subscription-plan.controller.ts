import { Controller, Post, Body, UseGuards, Req, Get, Param, Patch, Delete, } from '@nestjs/common';
import { SubscriptionPlanService } from '../service/subscription-plan.service';
import { AuthGuard } from 'src/guard/user.guard';
import { CreateSubscriptionPlanDto } from '../dto/create-subscription-plans.dto';

@Controller('subscription-plans')
export class SubscriptionPlanController {
    constructor(private readonly subscriptionPlanService: SubscriptionPlanService) {}

    @UseGuards(AuthGuard)
    @Post()
    async create(@Req() req, @Body() createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
        const userId = req.decoded.userId;
        return this.subscriptionPlanService.createSubscriptionPlan(userId, createSubscriptionPlanDto);
    }

    // auth in consideration
    @Get('gym/:gymId')
    @UseGuards(AuthGuard)
    async getPlansByGym(@Param('gymId') gymId: string) {
        return this.subscriptionPlanService.getSubscriptionPlansByGym(gymId);
    }

    @UseGuards(AuthGuard)
    @Patch(':planId')
    async update(@Req() req, @Param('planId') planId: string, @Body() updateData: Partial<CreateSubscriptionPlanDto>) {
        const userId = req.decoded.userId;
        return this.subscriptionPlanService.updateSubscriptionPlan(userId, planId, updateData);
    }

    @UseGuards(AuthGuard)
    @Delete(':planId')
    async delete(@Req() req, @Param('planId') planId: string) {
        const userId = req.decoded.userId;
        await this.subscriptionPlanService.deleteSubscriptionPlan(userId, planId);
        return { message: 'Subscription plan deleted successfully' };
    }

}
