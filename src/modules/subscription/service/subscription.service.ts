import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Gym } from 'src/modules/gym/entity/gym.entity';
import { Subscription } from '../entity/subscription.entity';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../dto/update-subscription.dto';
import { SubscriptionPlanService } from 'src/modules/subscription-plan/service/subscription-plan.service';
import { MemberService } from 'src/modules/members/members.service';
import { SubscriptionPlan } from 'src/modules/subscription-plan/entity/subscription-plan.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
    private readonly subscriptionPlanService: SubscriptionPlanService,
    private readonly memberService: MemberService,
  ) {}

  async createSubscription(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const subscriptionPlan =
      await this.subscriptionPlanService.getSubscriptionPlanById(
        new Types.ObjectId(createSubscriptionDto.planId),
      );
    console.log(subscriptionPlan, '*************************');

    // if (
    //   !this.isAuthorized(
    //     userId,
    //     (subscriptionPlan.gymId as Gym).userId.toString(),
    //   )
    // ) {
    //   throw new UnauthorizedException(
    //     'You are not authorized to create a subscription for this gym',
    //   );
    // }

    const subscription = await this.subscriptionModel.create({
      planId: new Types.ObjectId(createSubscriptionDto.planId),
      groupId: new Types.ObjectId(createSubscriptionDto.groupId),
      memberId: new Types.ObjectId(createSubscriptionDto.memberId),
      startDate: createSubscriptionDto.startDate,
    });
    // update member with subscription
    const member = await this.memberService.updateMember(
      createSubscriptionDto.memberId,
      {
        activeSubscriptions: subscription._id,
      },
    );
    console.log('************', member);
    return subscription.toObject();
  }

  async getAllSubscriptions(userId: string): Promise<Subscription[]> {
    return this.subscriptionModel.find().exec();
  }

  async getSubscriptionById(userId: string, id: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel.findById(id).lean();
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // if (!this.isAuthorized(userId, subscription.userId.toString())) {
    //   throw new UnauthorizedException(
    //     'You are not authorized to view this subscription',
    //   );
    // }

    return subscription;
  }

  async updateSubscription(
    userId: string,
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    const subsPlan = await this.subscriptionPlanService.getSubscriptionPlanById(
      new Types.ObjectId(updateSubscriptionDto.planId),
    );

    if (!this.isAuthorized(userId, (subsPlan.gymId as Gym).userId.toString())) {
      throw new UnauthorizedException(
        'You are not authorized to update this subscription',
      );
    }

    const subscription = await this.subscriptionModel
      .findByIdAndUpdate(id, updateSubscriptionDto, { new: true })
      .lean();
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    return subscription;
  }

  async deleteSubscription(userId: string, id: string): Promise<void> {
    const subscription = await this.subscriptionModel.findById(id).exec();
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const subsPlan = await this.subscriptionPlanService.getSubscriptionPlanById(
      subscription.planId as Types.ObjectId,
    );

    if (!this.isAuthorized(userId, (subsPlan.gymId as Gym).userId.toString())) {
      throw new UnauthorizedException(
        'You are not authorized to update this subscription',
      );
    }

    await this.subscriptionModel.deleteOne({ _id: id }).exec();
  }

  private isAuthorized(userId: string, ownerId: string): boolean {
    // Implement the logic to check if the user is authorized (e.g., is the gym owner or admin)
    return userId === ownerId;
  }

  async getRevenue(gymId: string, from: Date, to: Date): Promise<number> {
    console.log(new Date(from));
    const result = await this.subscriptionModel.aggregate([
      {
        $match: {
          startDate: { $gte: new Date(from), $lte: new Date(to) },
        },
      },
      {
        $lookup: {
          from: 'subscriptionplans',
          localField: 'planId',
          foreignField: '_id',
          as: 'plan',
        },
      },
      {
        $unwind: '$plan',
      },
      {
        $match: {
          'plan.gymId': gymId,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$plan.price' },
        },
      },
    ]);

    return result.length > 0 ? result[0].totalRevenue : 0;
  }
}
