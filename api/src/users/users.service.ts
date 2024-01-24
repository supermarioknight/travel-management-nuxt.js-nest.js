import { EntityRepository, FindOneOptions } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
  ) {}

  findOne(
    id: string,
    options?: { populate?: FindOneOptions<User, keyof User>['populate'] },
  ) {
    return this.userRepo.findOne(id, {
      populate: options?.populate ? options.populate : undefined,
    });
  }

  findOneByEmail(email: string, selectPassword = false) {
    return this.userRepo.findOne(
      { email },
      { populate: selectPassword ? ['password'] : [] },
    );
  }
}
