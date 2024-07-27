// member.controller.ts
import { Controller, Post, Put, Get, Param, Body, UseGuards } from '@nestjs/common';
import { UpdateMemberDto } from './dto/update-member.dto';
import { AuthGuard } from 'src/guard/user.guard';
import { MemberService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { Types } from 'mongoose';
import { UserService } from '../user/user.service';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createMemberDto: CreateMemberDto) {
    let user;
    const { userId, gymId, phoneNo, email, name } = createMemberDto;
    if(!userId){
      // create member simple
      user = await this.userService.create({
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" "),
        email: email,
        phoneNo: phoneNo,
        googleId: Date.now().toString(),
        image: createMemberDto.image,
        gender: createMemberDto.gender,
      })
    }
    const member = await this.memberService.addMember(userId ||  user._id, gymId);
    member.userId = user;
    console.log(member);
    return member;
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: UpdateMemberDto) {
    return this.memberService.updateMember(id, {
        ...updateData,
        userId: new Types.ObjectId(updateData.userId),
        gymId: new Types.ObjectId(updateData.gymId),
    });
  }

  @UseGuards(AuthGuard)
  @Get('gym/:gymId')
  findByGym(@Param('gymId') gymId: string) {
    return this.memberService.getMembersByGym(gymId);
  }

  @Get('dashboard/:gymId')
  // @UseGuards(AuthGuard)
  async getDashboard(@Param('gymId') gymId: string) {
    return this.memberService.getDashboard(gymId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getMemberById(@Param('id') id: string){
    return this.memberService.getMemberById(new Types.ObjectId(id));
  }
}