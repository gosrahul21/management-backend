import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { AuthGuard } from 'src/guard/user.guard';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createExpenseDto: CreateExpenseDto, @Req() req) {
    const { userId } = req.decoded;
    return this.expenseService.create(createExpenseDto, userId);
  }

  @Get(':gymId')
  @UseGuards(AuthGuard)
  findAll(@Param('gymId') gymId: string, @Req() req) {
    const { userId } = req.decoded;
    // Additional logic to check if the user is an admin or owner can be added here
    return this.expenseService.findAll(gymId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(id, updateExpenseDto as any);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.expenseService.remove(id);
  }

  @Get('gym/:gymId')
  @UseGuards(AuthGuard)
  async getExpenses(
    @Param('gymId') gymId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return this.expenseService.getTotalExpenses(gymId, fromDate, toDate);
  }

}
