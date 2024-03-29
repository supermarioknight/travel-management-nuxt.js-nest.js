import { EntityRepository, FilterQuery, QueryOrderMap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TravelsService } from '../travels/travels.service';
import { CreateTourInput } from './dto/create-tour.input';
import {
  FindToursArgs,
  PaginatedTours,
  ToursSortBy,
} from './dto/find-tours.args';
import { UpdateTourInput } from './dto/update-tour.input';
import { Tour } from './entities/tour.entity';
import { ApplyTourInput } from './dto/apply-tour.input';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { RevokeTourInput } from './dto/revoke-tour.input';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private tourRepo: EntityRepository<Tour>,
    private travelsService: TravelsService,
    @InjectRepository(User)
    private userRepo: EntityRepository<User>,
    private usersService: UsersService,
  ) {}

  async findByTravel(
    args: FindToursArgs,
    publicOnly: boolean,
  ): Promise<PaginatedTours> {
    const travel = await this.travelsService.findBySlug(args.travelSlug);

    if (!travel || (publicOnly && !travel.isPublic)) {
      throw new NotFoundException('travel-not-found');
    }

    const where: FilterQuery<Tour> = {
      travel,
    };

    const { dateFrom, dateTo, priceFrom, priceTo } = args;

    if (dateFrom || dateTo) {
      if (dateFrom && !dateTo) {
        where.startingDate = { $gte: dateFrom };
      }

      if (!dateFrom && dateTo) {
        where.endingDate = { $lte: dateTo };
      }

      if (dateFrom && dateTo) {
        where.startingDate = { $lte: dateTo };
        where.endingDate = { $gte: dateFrom };
      }
    }

    if (priceFrom) {
      where.price = { $gte: priceFrom * 100 };
    }

    if (priceTo) {
      where.price = { $lte: priceTo * 100 };
    }

    const orderBy: QueryOrderMap<Tour> = {};

    if (args.sortBy) {
      switch (args.sortBy) {
        case ToursSortBy.PRICE_ASC:
          orderBy.price = 'ASC';
          break;
        case ToursSortBy.PRICE_DESC:
          orderBy.price = 'DESC';
          break;
      }
    } else {
      orderBy.startingDate = 'ASC';
    }

    const [items, count] = await this.tourRepo.findAndCount(where, {
      populate: ['users'],
      orderBy,
      limit: args.rows,
      offset: args.rows * (args.page - 1),
    });

    return {
      items,
      count,
    };
  }

  async findOne(id: string) {
    const tour = await this.tourRepo.findOne(id, { populate: ['users'] });

    if (!tour) {
      throw new NotFoundException(`tour-not-found`);
    }

    return tour;
  }

  async create(input: CreateTourInput) {
    // validate dates

    if (input.startingDate >= input.endingDate) {
      throw new BadRequestException('invalid-dates');
    }

    // validate name

    const existingByName = await this.tourRepo.findOne({
      name: input.name,
    });

    if (existingByName) {
      throw new ConflictException('name-already-exists');
    }

    const travel = await this.travelsService.findOne(input.travelId);

    if (!travel) {
      throw new NotFoundException('travel-not-found');
    }

    // create and save

    const tour = this.tourRepo.create({
      ...input,
      price: input.price * 100,
    });

    tour.travel = travel;

    await this.tourRepo.persistAndFlush(tour);

    return tour;
  }

  async update(input: UpdateTourInput) {
    const tour = await this.tourRepo.findOne(input.id);

    if (!tour) {
      throw new NotFoundException('tour-not-found');
    }

    // validate & set dates

    const finalStartingDate = input.startingDate || tour.startingDate;
    const finalEndingDate = input.endingDate || tour.endingDate;

    if (finalStartingDate >= finalEndingDate) {
      throw new BadRequestException('invalid-dates');
    }

    tour.startingDate = finalStartingDate;
    tour.endingDate = finalEndingDate;

    // validate & set name

    if (input.name) {
      const existingByName = await this.tourRepo.findOne({
        name: input.name,
      });

      if (existingByName && existingByName.id !== tour.id) {
        throw new ConflictException('name-already-exists');
      }

      tour.name = input.name;
    }

    // set price

    if (typeof input.price !== 'undefined') {
      tour.price = input.price * 100;
    }

    // and finally save

    await this.tourRepo.persistAndFlush(tour);

    return tour;
  }

  async delete(id: string) {
    const tour = await this.tourRepo.findOne(id);

    if (!tour) {
      throw new NotFoundException(`tour-not-found`);
    }

    return this.tourRepo.removeAndFlush(tour);
  }

  async apply(input: ApplyTourInput) {
    const tour = await this.tourRepo.findOne(input.tourId);

    if (!tour) {
      throw new NotFoundException('tour-not-found');
    }

    // find user

    const user = await this.usersService.findOne(input.userId);

    if (!user) {
      throw new NotFoundException('user-not-found');
    }

    // set user

    tour.users.add(user);

    // set tour

    user.tours.add(tour);

    // and finally save

    await this.tourRepo.persistAndFlush(tour);
    await this.userRepo.persistAndFlush(user);

    return true;
  }

  async revoke(input: RevokeTourInput) {
    const tour = await this.tourRepo.findOne(input.tourId, {
      populate: ['users'],
    });

    if (!tour) {
      throw new NotFoundException('tour-not-found');
    }

    // find user

    const user = await this.usersService.findOne(input.userId, {
      populate: ['tours'],
    });

    if (!user) {
      throw new NotFoundException('user-not-found');
    }

    // set user

    tour.users.remove(user);

    // set tour

    user.tours.remove(tour);

    // and finally save

    await this.tourRepo.persistAndFlush(tour);
    await this.userRepo.persistAndFlush(user);

    return true;
  }
}
