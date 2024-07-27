import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Gym } from 'src/modules/gym/entity/gym.entity';
import { Expense } from './expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(Gym.name) private gymModel: Model<Gym>,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    userId: string,
  ): Promise<Expense> {
    const gym = await this.gymModel.findById(createExpenseDto.gymId).exec();
    if (!gym) {
      throw new NotFoundException('Gym not found');
    }

    const expense = new this.expenseModel({
      ...createExpenseDto,
      userId: new Types.ObjectId(userId),
    });
    return expense.save();
  }

  async findAll(gymId: string): Promise<Expense[]> {
    return this.expenseModel.find({ gymId }).exec();
  }

  async findOne(id: string): Promise<Expense> {
    const expense = await this.expenseModel.findById(id).exec();
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async update(
    id: string,
    updateExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.expenseModel
      .findByIdAndUpdate(id, updateExpenseDto, { new: true })
      .exec();
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async remove(id: string): Promise<void> {
    const expense = await this.expenseModel.findByIdAndDelete(id).exec();
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
  }

  async getTotalExpenses(
    gymId: string,
    from: Date,
    to: Date,
  ): Promise<{ totalExpenses: number }> {
    const expenses = await this.expenseModel
      .find({ createdAt: { $gte: from, $lte: to }, gymId })
      .lean();

    const totalExpenses = expenses.reduce(
      (total, expense) => total + expense.amount,
      0,
    );
    return { totalExpenses };
  }
}
