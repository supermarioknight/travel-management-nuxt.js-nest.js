import { InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class ApplyTourInput {
  @IsString()
  @IsUUID()
  tourId: string;

  @IsString()
  @IsUUID()
  userId: string;
}
