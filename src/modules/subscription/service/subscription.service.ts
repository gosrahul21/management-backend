import {
  BadRequestException,
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
    const subscription = await this.subscriptionModel
      .findById(id)
      .populate('planId')
      .lean();
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Fetch the subscription plan details to get `durationInDays`
    const subscriptionPlan = subscription.planId as SubscriptionPlan;
    if (!subscriptionPlan) {
      throw new NotFoundException('Subscription plan not found');
    }
    return subscription;
  }

  getRemainingAndElapesedDays(
    subscription: Subscription,
    subscriptionPlan: SubscriptionPlan,
  ): { remainingDays: number; elapsedDays: number; holdDuration: number } {
    const totalDuration = subscriptionPlan.durationInDays;
    const startDate = new Date(subscription.startDate);
    const currentDate = new Date();

    // Calculate hold duration in days
    const holdDuration =
      subscription.holdDate?.reduce((total, holdPeriod) => {
        const pauseDate = new Date(holdPeriod.pauseDate);
        if (pauseDate > currentDate) return total;
        const restartDate =
          holdPeriod.restartDate && holdPeriod.restartDate < currentDate
            ? new Date(holdPeriod.restartDate)
            : currentDate;
        return (
          total +
          (restartDate.getTime() - pauseDate.getTime()) / (1000 * 60 * 60 * 24)
        );
      }, 0) || 0;

    // Calculate remaining days
    const elapsedDays =
      (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24) - holdDuration;
    const remainingDays = Math.max(0, totalDuration - Math.floor(elapsedDays));
    return { remainingDays, elapsedDays, holdDuration };
  }

  validateAndUpdateStartDate(
    currentStartDate: Date,
    newStartDate: Date,
    holdDates: { pauseDate: Date; restartDate?: Date }[],
  ) {
    const currentDate = new Date();

    if (currentDate >= currentStartDate) {
      // Start date is already active
      if (newStartDate < currentDate) {
        throw new Error('New start date cannot be earlier than today.');
      }
    }

    // Check for overlap with hold periods
    holdDates.forEach((period) => {
      if (
        newStartDate >= new Date(period.pauseDate) &&
        (!period.restartDate || newStartDate <= new Date(period.restartDate))
      ) {
        throw new Error('New start date cannot fall within a pause period.');
      }
    });

    return newStartDate;
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

  async holdSubscription(
    subscriptionId: string,
    holdDate: Date,
    restartDate: Date,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionModel
      .findById(subscriptionId)
      .populate('planId')
      .exec();

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Fetch subscription plan to get the duration
    const subscriptionPlan = subscription.planId as SubscriptionPlan;

    const { remainingDays, elapsedDays, holdDuration } =
      this.getRemainingAndElapesedDays(subscription, subscriptionPlan);
    const totalDuration = subscriptionPlan.durationInDays;
    const startDate = new Date(subscription.startDate);

    // Check if the hold date is within the remaining subscription period
    // Validate the provided holdDate
    const providedHoldDate = new Date(holdDate);
    const endDate = new Date(
      startDate.getTime() + totalDuration * 24 * 60 * 60 * 1000,
    );
    const adjustedEndDate = new Date(
      endDate.getTime() + holdDuration * 24 * 60 * 60 * 1000,
    );

    if (providedHoldDate > adjustedEndDate || providedHoldDate < new Date()) {
      throw new BadRequestException(
        'Hold date must be within the remaining subscription period.',
      );
    }

    // Update holdDate
    subscription.holdDate = subscription.holdDate
      ? [...subscription.holdDate, { pauseDate: providedHoldDate, restartDate }]
      : [{ pauseDate: providedHoldDate, restartDate }];

    return subscription.save();
  }

  validateAndMergeHoldPeriods(
    existingHoldPeriods: { pauseDate: Date; restartDate?: Date }[],
    newHoldPeriods: { pauseDate: Date; restartDate?: Date }[],
  ) {
    const allPeriods = [...existingHoldPeriods, ...newHoldPeriods];

    // Sort by pause date
    allPeriods.sort(
      (a, b) =>
        new Date(a.pauseDate).getTime() - new Date(b.pauseDate).getTime(),
    );

    // Validate sequence
    this.validatePauseRestartSequence(allPeriods);

    return allPeriods;
  }
  validatePauseRestartSequence(
    holdDates: { pauseDate: Date; restartDate?: Date }[],
  ) {
    if (!holdDates || holdDates.length === 0) return;

    holdDates.forEach((period, index) => {
      if (!period.pauseDate) {
        throw new Error(
          `Pause date is required for hold period at index ${index}`,
        );
      }
      if (period.restartDate && period.pauseDate >= period.restartDate) {
        throw new Error(
          `Pause date must be earlier than restart date for hold period at index ${index}`,
        );
      }

      if (index > 0) {
        const previousPeriod = holdDates[index - 1];
        if (
          previousPeriod.restartDate &&
          previousPeriod.restartDate > period.pauseDate
        ) {
          throw new Error(
            `Restart date of the previous hold period must be before the pause date of the next period.`,
          );
        }
      }
    });
  }

  async updateSubscription(
    userId: string,
    id: string,
    updateDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionModel
      .findById(id)
      .populate('planId')
      .lean();
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const plan = subscription.planId as SubscriptionPlan;

    if (!this.isAuthorized(userId, plan.gymId.toString())) {
      throw new UnauthorizedException(
        'You are not authorized to update this subscription',
      );
    }

    const updatedData: Partial<Subscription> = {};

    // Update start date
    if (updateDto.startDate) {
      updatedData.startDate = this.validateAndUpdateStartDate(
        subscription.startDate,
        updateDto.startDate,
        subscription.holdDate || [],
      );
    }

    // Update hold periods
    if (updateDto.holdDate) {
      updatedData.holdDate = this.validateAndMergeHoldPeriods(
        subscription.holdDate || [],
        updateDto.holdDate,
      );
    }

    // Update other fields (e.g., planId)
    if (updateDto.planId) {
      updatedData.planId = new Types.ObjectId(updateDto.planId);
    }

    return this.subscriptionModel
      .findByIdAndUpdate(id, updatedData, { new: true })
      .exec();
  }
}
