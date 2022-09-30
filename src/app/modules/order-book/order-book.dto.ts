import { IsNotEmpty, IsString, IsNumber, IsPositive, IsIn } from 'class-validator';

export class GetOrderBookDTO {

  @IsString()
  @IsNotEmpty()
  readonly pair: string;
}
