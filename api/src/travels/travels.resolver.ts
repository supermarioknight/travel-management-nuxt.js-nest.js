import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, Public, UseAuthGuards } from '../auth/auth.decorators';
import { AuthUser } from '../auth/auth.types';
import { All, Organizer } from '../auth/roles.decorator';
import { CreateTravelInput } from './dto/create-travel.input';
import { FindTravelsArgs, PaginatedTravels } from './dto/list-travels.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { Travel } from './entities/travel.entity';
import { TravelsService } from './travels.service';
import { Role } from 'src/users/entities/user.entity';

@UseAuthGuards()
@Resolver(() => Travel)
export class TravelsResolver {
  constructor(private readonly travelsService: TravelsService) {}

  @Public()
  @Query(() => PaginatedTravels, { name: 'travels' })
  findAll(@Args() args: FindTravelsArgs, @CurrentUser() user: AuthUser | null) {
    return this.travelsService.findAll({
      publicOnly: user.role === Role.TRAVELER,
      ...args,
    });
  }

  @All()
  @Query(() => Travel, { name: 'travel' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.travelsService.findOne(id);
  }

  @Organizer()
  @Mutation(() => Travel)
  createTravel(@Args('data') input: CreateTravelInput) {
    return this.travelsService.create(input);
  }

  @Organizer()
  @Mutation(() => Travel)
  updateTravel(@Args('data') input: UpdateTravelInput) {
    return this.travelsService.update(input.id, input);
  }

  @Organizer()
  @Mutation(() => Boolean)
  async deleteTravel(@Args('id', { type: () => String }) id: string) {
    await this.travelsService.delete(id);
    return true;
  }
}
