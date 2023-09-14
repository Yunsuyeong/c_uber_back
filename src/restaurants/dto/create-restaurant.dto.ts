import { ArgsType, Field, InputType, OmitType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class CreateRestaurantDto extends OmitType(
  Restaurant,
  ['id'],
  InputType,
) {}

/* @Field(() => String)
  @IsString()
  @Length(5, 10)
  name: string;
  @Field(() => Boolean)
  @IsBoolean()
  isVegan: boolean;
  @Field(() => String)
  @IsString()
  address: string;
  @Field(() => String)
  @IsString()
  ownersName: string; */
