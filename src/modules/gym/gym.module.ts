// tested
import { Module, forwardRef } from '@nestjs/common';
import { GymController } from './controllers/gym.controller';
import { GymService } from './service/gym.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Gym, GymSchema } from './entity/gym.entity';
import { EmployeeModule } from '../employee/employee.module';

@Module({
    imports: [
        MongooseModule.forFeature([
          {
            name: Gym.name,
            schema: GymSchema,
          },
        ]),
        JwtModule,
        EmployeeModule,
      ],
    providers: [
        GymService,
    ],
    controllers: [
        GymController,
    ],
    exports: [
      GymService
    ]
})
export class GymModule {}
