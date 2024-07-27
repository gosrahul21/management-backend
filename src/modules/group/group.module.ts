// tested - ok
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './entities/group.entity';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './service/group.service';
import { JwtModule } from '@nestjs/jwt';
import { GymModule } from '../gym/gym.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Group.name, schema: GroupSchema },
        ]),
        JwtModule,
        GymModule,
    ],
    controllers: [GroupController],
    providers: [GroupService],
})
export class GroupModule {}
