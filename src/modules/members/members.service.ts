// member.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Member, MemberDocument } from './entity/member.entity';
import { Subscription } from '../subscription/entity/subscription.entity';
import { SubscriptionPlan } from '../subscription-plan/entity/subscription-plan.entity';
import { EmployeeService } from '../employee/services/employee.service';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    private readonly employeeService: EmployeeService,

  ) {}

  async addMember(userId: string, gymId: string): Promise<Member> {
    const member = await this.memberModel.create({ userId, gymId });
    console.log(member.toObject())
    return member.toObject();
  }

  async updateMember(
    memberId: string,
    updateData: Partial<Member>,
  ): Promise<Member> {
    const member = await this.memberModel.findByIdAndUpdate(
      memberId,
      updateData,
      { new: true },
    );
    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }
    return member;
  }

  async getMembersByGym(gymId: string): Promise<Member[]> {
    return this.memberModel
      .find({ gymId })
      .populate([
        'userId',
        {
          path: 'activeSubscriptions',
          populate: {
            path: 'planId',
          },
        },
      ])
      .lean();
  }

  async getDashboard(gymId: string): Promise<any> {
    const members = await this.memberModel
      .find({ gymId })
      .populate([
        {
          path: 'activeSubscriptions',
          populate: {
            path: 'planId',
          },
        },
      ])
      .lean();

    const totalClients = members.length;
    const activeClients = members.filter((member) => member.isActive).length;
    const inactiveClients = totalClients - activeClients;

    const newClients = members.filter((member) => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return new Date(member.createdAt) > oneMonthAgo;
    }).length;

    const membershipExpiring = members.filter((member) => {
      if (!member.activeSubscriptions) return false;
      const today = new Date();
      const expiryDate = new Date(
        (member.activeSubscriptions as Subscription)?.startDate,
      );
      expiryDate.setDate(
        expiryDate.getDate() +
          (
            (member.activeSubscriptions as Subscription)
              ?.planId as SubscriptionPlan
          )?.durationInDays || 0,
      );
      const oneWeekAhead = new Date();
      oneWeekAhead.setDate(today.getDate() + 7);
      return expiryDate <= oneWeekAhead && expiryDate >= today;
    }).length;

    return {
      totalClients,
      activeClients,
      inactiveClients,
      newClients,
      membershipExpiring,
      totalEmployees: await this.employeeService.getEmployeesCount(gymId)
    };
  }

  async getMemberById(memberId: Types.ObjectId) {
    try {
      const member = await this.memberModel
        .findById(memberId)
        .populate([
          'gymId',
          'userId',
          {
            path: 'activeSubscriptions',
            populate: {
              path: 'planId',
            },
          },
        ])
        .lean();
      if (!member) throw new NotFoundException('No member found');
      return member;
    } catch (error) {
      throw error;
    }
  }
}
