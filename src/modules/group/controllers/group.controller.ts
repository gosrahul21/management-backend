import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete } from '@nestjs/common';
import { GroupService } from '../service/group.service';
import { CreateGroupDto } from '../dto/create-group.dto';
import { AuthGuard } from 'src/guard/user.guard';
import { UpdateGroupDto } from '../dto/update-group.dto';


@Controller('groups')
export class GroupController {
    constructor(private readonly groupService: GroupService) {}

    @UseGuards(AuthGuard)
    @Post()
    async create(@Request() req, @Body() createGroupDto: CreateGroupDto) {
        const userId = req.decoded.userId;
        return this.groupService.createGroup(userId, createGroupDto);
    }

    @Get('gym/:gymId')
    @UseGuards(AuthGuard)
    async getGroupsByGym(@Param('gymId') gymId: string) {
        return this.groupService.getGroupsByGym(gymId);
    }

    @UseGuards(AuthGuard)
    @Patch(':groupId')
    async update(@Request() req, @Param('groupId') groupId: string, @Body() updateGroupDto: UpdateGroupDto) {
        const userId = req.decoded.userId;
        return this.groupService.updateGroup(userId, groupId, updateGroupDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':groupId')
    async delete(@Request() req, @Param('groupId') groupId: string) {
        const userId = req.decoded.userId;
        await this.groupService.deleteGroup(userId, groupId);
        return { message: 'Group deleted successfully' };
    }
}
