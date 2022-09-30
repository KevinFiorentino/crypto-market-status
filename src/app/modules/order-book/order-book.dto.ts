import { IsNotEmpty, IsString, IsNumber, IsPositive, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetOrderBookDTO {

  @ApiProperty({ description: 'Ex: BTCUSD, ETHUSD' })
  @IsString()
  @IsNotEmpty()
  readonly pair: string;
}
