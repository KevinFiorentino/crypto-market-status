import { IsNotEmpty, IsString, IsNumber, IsPositive, IsIn } from 'class-validator';

export type TypeOrder = 'buy' | 'sell';

export class CreateOrderDTO {

  @IsString()
  @IsNotEmpty()
  readonly pair: string;

  @IsNotEmpty()
  @IsIn(['buy', 'sell'])
  readonly type: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly amount: number;
}
