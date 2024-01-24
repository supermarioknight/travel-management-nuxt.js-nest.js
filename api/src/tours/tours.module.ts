import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TravelsModule } from '../travels/travels.module';
import { Tour } from './entities/tour.entity';
import { ToursResolver } from './tours.resolver';
import { ToursService } from './tours.service';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Tour]),
    TravelsModule,
    MikroOrmModule.forFeature([User]),
    UsersModule,
  ],
  providers: [ToursResolver, ToursService],
})
export class ToursModule {}
