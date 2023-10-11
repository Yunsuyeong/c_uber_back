import { Field, InputType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class DeleteRestaurantInput {
  @Field(() => Number)
  restaurantId: number;
}

export class DeleteRestaurantOutput extends CoreOutput {}
