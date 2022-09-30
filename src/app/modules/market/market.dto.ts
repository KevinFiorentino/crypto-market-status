import { IsNotEmpty, IsString, IsNumber, IsIn } from 'class-validator';

export type TypeOrder = 'buy' | 'sell';

export class CreateOrderDTO {

  @IsString()
  @IsNotEmpty()
  readonly pair: string;

  @IsNotEmpty()
  @IsIn(['buy', 'sell'])
  readonly type: string;

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;
}
