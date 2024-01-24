import {
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToMany,
  Property,
} from '@mikro-orm/core';
import {
  Field,
  HideField,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { BaseEntity } from '../../common/base.entity';
import { Tour } from '../../tours/entities/tour.entity';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Property({ unique: true })
  email: string;

  @HideField()
  @Property({ lazy: true, hidden: true })
  password: string;

  @Enum(() => Role)
  role: Role;

  @Field(() => [Tour])
  @ManyToMany(() => Tour, (tour) => tour.users, {
    owner: true,
    cascade: [Cascade.REMOVE],
  })
  tours = new Collection<Tour>(this);
}

export enum Role {
  TRAVELER = 'traveler',
  ORGANIZER = 'organizer',
}

registerEnumType(Role, {
  name: 'Role',
});
