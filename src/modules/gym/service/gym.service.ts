import { Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateGymDto } from '../dto/create-gym.dto';
import { Gym, GymDocument } from '../entity/gym.entity';
import { UpdateGymDto } from '../dto/update-gym.dto';

@Injectable()
export class GymService {
  constructor(
    @InjectModel(Gym.name) private readonly gymModel: Model<Gym>,
    ) {}

  async create(createGymData: any): Promise<Gym> {
    const createdGym = new this.gymModel(createGymData);
    return createdGym.save();
  }

  async findAll(userId: Types.ObjectId): Promise<Gym[]> {
    return this.gymModel.aggregate([
      {
        $lookup: {
          from: 'employees', // The collection name in MongoDB for Employee
          localField: '_id',
          foreignField: 'gymId',
          as: 'employees',
        },
      },
      {
        $match: {
          $or: [
            { userId }, // Admin userId
            { 'employees.userId': userId }, // Employee userId
          ],
        },
      },
      {
        $addFields: {
          roles: {
            $filter: {
              input: '$employees',
              as: 'employee',
              cond: { $eq: ['$$employee.userId', userId] },
            },
          },
        },
      },
      {
        $addFields: {
          role: {
            $cond: {
              if: { $gt: [{ $size: '$roles' }, 0] },
              then: { $arrayElemAt: ['$roles.role', 0] },
              else: 'Admin',
            },
          },
        },
      },
      {
        $project: {
          employees: 0, // Remove the employees field as it's not needed
          roles: 0,     // Remove the temporary roles field
        },
      },
    ]).exec();
  }

  async findOne(id: any): Promise<Gym> {
    const gym = await this.gymModel.findById(id).populate('userId').lean();
    if (!gym) {
      throw new NotFoundException(`Gym #${id} not found`);
    }
    return gym;
  }

  async updateByUserId(
    userId: string,
    updateGymDto: UpdateGymDto,
  ): Promise<Gym> {
    const existingGym = await this.gymModel
      .findOneAndUpdate(
        {
          userId: new Types.ObjectId(userId),
          _id: updateGymDto._id,
        },
        updateGymDto,
        {
          new: true,
        },
      )
      .lean();

    if (!existingGym) {
      throw new NotFoundException(`Gym #${updateGymDto._id} not found`);
    }
    return existingGym;
  }

  async removeByUser(id: string, userId: string): Promise<Gym> {
    const deletedGym = await this.gymModel
      .findOneAndDelete({ id, userId })
      .exec();
    if (!deletedGym) {
      throw new NotFoundException(`Gym #${id} not found`);
    }
    return deletedGym;
  }
}
