import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,                    // Prohibit data that is not in the DTOs
      forbidNonWhitelisted: true,
      disableErrorMessages: process.env.ENVIRONMENT == 'production' ? true : false,     // Disable only production
      transformOptions: {
        enableImplicitConversion: true,   // Convert query params in numbers
      },
    })
  );

  app.setGlobalPrefix("/api/");

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
