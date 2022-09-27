import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';



const SERVICES = [

];

@Module({
  imports: [
    HttpModule
  ],
  providers: SERVICES,
  exports: SERVICES
})
export class SharedModule {}
