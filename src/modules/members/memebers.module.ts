import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { MemberService } from './members.service';
import { MemberController } from './members.controller';
import { Member, MemberSchema } from './entity/member.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    JwtModule,
    EmployeeModule
  ],
  controllers: [MemberController],
  providers: [MemberService],
  exports:[MemberService]
})
export class MemberModule {}
