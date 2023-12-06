import { Field, InputType, Int } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class DeleteRestaurantInput {
  @Field(() => Int)
  restaurantId: number;
}

export class DeleteRestaurantOutput extends CoreOutput {}
