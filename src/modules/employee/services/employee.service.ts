import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Gym } from 'src/modules/gym/entity/gym.entity';
import { Employee, EmployeeDocument } from '../entity/employee.entity';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { GymService } from 'src/modules/gym/service/gym.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    private readonly gymService: GymService,
  ) {}

  async create(createEmployeeDto: Partial<Employee>): Promise<Employee> {
    const gym = await this.gymService.findOne(createEmployeeDto.gymId);
    if (!gym) {
      throw new NotFoundException('Gym not found');
    }
    // create user if no UserId found
    const employee = await this.employeeModel.create({
      userId: createEmployeeDto.userId,
      gymId: createEmployeeDto.gymId,
      startDate: createEmployeeDto.startDate,
      role: createEmployeeDto.role,
    });
    return employee.toObject();
  }

  async findAll(gymId: Types.ObjectId): Promise<Employee[]> {
    return this.employeeModel.find({ gymId }).populate('userId').lean();
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeModel
      .findById(id)
      .populate('userId')
      .lean();
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.employeeModel
      .findByIdAndUpdate(id, updateEmployeeDto, { new: true })
      .exec();
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  async remove(id: string): Promise<void> {
    const employee = await this.employeeModel.findByIdAndDelete(id).exec();
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
  }
}
