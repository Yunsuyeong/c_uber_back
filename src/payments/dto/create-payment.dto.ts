import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Payment } from '../entities/payment.entity';

@InputType()
export class CreatePaymentInput extends PickType(Payment, ['transactionId']) {
  @Field(() => Number)
  restaurantId: number;
}

@ObjectType()
export class CreatePaymentOutput extends CoreOutput {}
