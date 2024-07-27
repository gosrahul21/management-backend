import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDto } from '../dto/create-group.dto';
import { Group } from '../entities/group.entity';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { GymService } from 'src/modules/gym/service/gym.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<Group>,
    private readonly gymService: GymService,
  ) {}

  async createGroup(
    userId: string,
    createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    const gym = await this.gymService.findOne(createGroupDto.gymId);
    if (!gym) {
      throw new NotFoundException('Gym not found');
    }

    const isCreator = gym.userId._id.toString() === userId;
    const isAdmin = await this.isAdmin(userId, gym._id.toString());

    if (!isCreator && !isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to update this group',
      );
    }

    const group = new this.groupModel(createGroupDto);
    return group.save();
  }

  async getGroupsByGym(gymId: string): Promise<Group[]> {
    return this.groupModel.find({ gymId }).lean();
  }

  async updateGroup(
    userId: string,
    groupId: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const gym = await this.gymService.findOne(group.gymId);
    if (!gym) {
      throw new NotFoundException('Gym not found');
    }

    const isCreator = gym.userId._id.toString() === userId;
    const isAdmin = await this.isAdmin(userId, gym._id.toString());

    if (!isCreator && !isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to update this group',
      );
    }

    return await this.groupModel
      .findByIdAndUpdate(groupId, updateGroupDto, { new: true })
      .lean();
  }

  async deleteGroup(userId: string, groupId: string): Promise<void> {
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const gym = await this.gymService.findOne(group.gymId);
    if (!gym) {
      throw new NotFoundException('Gym not found');
    }

    const isCreator = gym.userId._id.toString() === userId;
    const isAdmin = await this.isAdmin(userId, gym._id.toString());

    if (!isCreator && !isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to delete this group',
      );
    }

    await this.groupModel.findByIdAndDelete(groupId).exec();
  }

  async isAdmin(userId: string, gymId: string): Promise<boolean> {
    // Implement logic to check if user is an admin of the gym
    return false;
  }
}
