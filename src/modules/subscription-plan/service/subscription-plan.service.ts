import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SubscriptionPlan } from '../entity/subscription-plan.entity';
import { CreateSubscriptionPlanDto } from '../dto/create-subscription-plans.dto';
import { GymService } from 'src/modules/gym/service/gym.service';

@Injectable()
export class SubscriptionPlanService {
  constructor(
    @InjectModel(SubscriptionPlan.name)
    private subscriptionPlanModel: Model<SubscriptionPlan>,
    private gymService: GymService,
  ) {}

  async createSubscriptionPlan(
    userId: string,
    createSubscriptionPlanDto: CreateSubscriptionPlanDto,
  ): Promise<SubscriptionPlan> {
    const gym = await this.gymService.findOne(createSubscriptionPlanDto.gymId);
    if (!gym) {
      throw new NotFoundException('Gym not found');
    }
    // creator of gym authentication
    if (gym.userId._id.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to create a subscription plan for this gym',
      );
    }
    const subscriptionPlan = await this.subscriptionPlanModel.create(
      createSubscriptionPlanDto,
    );
    return subscriptionPlan.toObject();
  }

  async getSubscriptionPlansByGym(gymId: string): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlanModel.find({ gymId }).lean();
  }

  async getSubscriptionPlanById(planId: Types.ObjectId): Promise<SubscriptionPlan> {
    const subscriptionPlan = await this.subscriptionPlanModel
      .findById(new Types.ObjectId(planId))
      .populate('gymId').lean();
    if (!subscriptionPlan)
      throw new NotFoundException(`Plan with id ${planId} not found`);
    return subscriptionPlan;
  }

  async updateSubscriptionPlan(
    userId: string,
    planId: string,
    updateData: Partial<CreateSubscriptionPlanDto>,
  ): Promise<SubscriptionPlan> {
    const subscriptionPlan = await this.subscriptionPlanModel.findById(planId);
    if (!subscriptionPlan) {
      throw new NotFoundException('Subscription plan not found');
    }

    const gym = await this.gymService.findOne(subscriptionPlan.gymId as Types.ObjectId);
    if (!gym) {
      throw new NotFoundException('Gym not found');
    }

    const isCreator = gym.userId._id.toString() === userId;
    const isAdmin = await this.isAdmin(userId, gym._id.toString());

    if (!isCreator && !isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to update this subscription plan',
      );
    }

    Object.assign(subscriptionPlan, updateData);
    return subscriptionPlan.save();
  }

  async deleteSubscriptionPlan(userId: string, planId: string): Promise<void> {
    const subscriptionPlan = await this.subscriptionPlanModel.findById(planId);
    if (!subscriptionPlan) {
      throw new NotFoundException('Subscription plan not found');
    }

    const gym = await this.gymService.findOne(subscriptionPlan.gymId);
    if (!gym) {
      throw new NotFoundException('Gym not found');
    }

    const isCreator = gym.userId._id.toString() === userId;
    const isAdmin = await this.isAdmin(userId, gym._id.toString());

    if (!isCreator && !isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to delete this subscription plan',
      );
    }

    await this.subscriptionPlanModel.deleteOne({ _id: planId }).exec();
  }

  async isAdmin(userId: string, gymId: string): Promise<boolean> {
    // Implement logic to check if user is an admin of the gym
    return false;
  }
}
