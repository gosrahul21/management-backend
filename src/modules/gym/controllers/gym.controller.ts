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
import { CreateGymDto } from '../dto/create-gym.dto';
import { UpdateGymDto } from '../dto/update-gym.dto';
import { GymService } from '../service/gym.service';
import { AuthGuard } from 'src/guard/user.guard';
import { Types } from 'mongoose';

@Controller('gyms')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createGymDto: CreateGymDto, @Req() req) {
    const { userId } = req.decoded;
    console.log({ userId, ...createGymDto });
    return this.gymService.create({
      userId: new Types.ObjectId(userId as string),
      ...createGymDto,
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req) {
    const { userId } = req.decoded;
    return this.gymService.findAll(new Types.ObjectId(userId as string));
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.gymService.findOne(id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  update(@Body() updateGymDto: UpdateGymDto, @Req() req) {
    const { userId } = req.decoded;
    console.log(userId)
    return this.gymService.updateByUserId(userId,updateGymDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req ){
    return this.gymService.removeByUser(id, req.decoded.userId);
  }
}
