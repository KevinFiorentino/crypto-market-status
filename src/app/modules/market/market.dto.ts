import { IsNotEmpty, IsString, IsNumber, IsPositive, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type TypeOrder = 'buy' | 'sell';

export class CreateOrderDTO {

  @ApiProperty({ description: 'Ex: BTCUSD, ETHUSD' })
  @IsString()
  @IsNotEmpty()
  readonly pair: string;

  @ApiProperty({ description: 'Types available: buy | sell' })
  @IsNotEmpty()
  @IsIn(['buy', 'sell'])
  readonly type: string;

  @ApiProperty({ description: 'Must be positive' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly amount: number;
}
