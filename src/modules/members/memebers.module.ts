import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { MemberService } from './members.service';
import { MemberController } from './members.controller';
import { Member, MemberSchema } from './entity/member.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    JwtModule,
  ],
  controllers: [MemberController],
  providers: [MemberService],
  exports:[MemberService]
})
export class MemberModule {}
