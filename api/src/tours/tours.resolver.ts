import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, Public, UseAuthGuards } from '../auth/auth.decorators';
import { AuthUser } from '../auth/auth.types';
import { All, Organizer, Traveler } from '../auth/roles.decorator';
import { CreateTourInput } from './dto/create-tour.input';
import { FindToursArgs, PaginatedTours } from './dto/find-tours.args';
import { UpdateTourInput } from './dto/update-tour.input';
import { ApplyTourInput } from './dto/apply-tour.input';
import { RevokeTourInput } from './dto/revoke-tour.input';
import { Tour } from './entities/tour.entity';
import { ToursService } from './tours.service';

@UseAuthGuards()
@Resolver(() => Tour)
export class ToursResolver {
  constructor(private readonly toursService: ToursService) {}

  @Public()
  @Query(() => PaginatedTours, { name: 'toursByTravel' })
  findByTravel(
    @Args() args: FindToursArgs,
    @CurrentUser() user: AuthUser | null,
  ) {
    return this.toursService.findByTravel(args, user === null);
  }

  @All()
  @Query(() => Tour, { name: 'tour' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.toursService.findOne(id);
  }

  @Organizer()
  @Mutation(() => Tour)
  createTour(@Args('data') input: CreateTourInput) {
    return this.toursService.create(input);
  }

  @Organizer()
  @Mutation(() => Tour)
  updateTour(@Args('data') input: UpdateTourInput) {
    return this.toursService.update(input);
  }

  @Organizer()
  @Mutation(() => Boolean)
  async deleteTour(@Args('id', { type: () => String }) id: string) {
    await this.toursService.delete(id);
    return true;
  }

  @Traveler()
  @Mutation(() => Boolean)
  applyTour(@Args('data') input: ApplyTourInput) {
    return this.toursService.apply(input);
  }

  @All()
  @Mutation(() => Boolean)
  revokeTour(@Args('data') input: RevokeTourInput) {
    return this.toursService.revoke(input);
  }
}
