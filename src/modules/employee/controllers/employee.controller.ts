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
} from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { AuthGuard } from 'src/guard/user.guard';
import { Types } from 'mongoose';
import { UserService } from 'src/modules/user/user.service';

@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createEmployeeDto: CreateEmployeeDto, @Req() req) {
    const { userId } = req.decoded;
    let user;
    if (!createEmployeeDto.userId) {
      user = await this.userService.create({
        firstName: createEmployeeDto.name.split(' ')[0],
        lastName: createEmployeeDto.name.split(' ').slice(1).join(' '),
        email: createEmployeeDto.email,
        phoneNo: createEmployeeDto.phoneNo,
        googleId: Date.now().toString(),
        image: createEmployeeDto.image,
        gender: createEmployeeDto.gender,
      });
    }
    return this.employeeService.create({
      ...createEmployeeDto,
      gymId: new Types.ObjectId(createEmployeeDto.gymId),
      userId: user?._id || new Types.ObjectId(userId as string),
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req) {
    const { userId } = req.decoded;
    return this.employeeService.findAll(userId);
  }

  @Get('/gym/:gymId')
  @UseGuards(AuthGuard)
  listGymEmployees( @Param('gymId') gymId: string) {
    console.log('gym', gymId)
    return this.employeeService.findAll(new Types.ObjectId(gymId));
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: CreateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
