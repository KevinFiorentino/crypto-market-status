import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

  // Config Swagger
  const config = new DocumentBuilder()
    .setTitle('Backend Membrane - API')
    .setDescription('Challenge Membrane Backend - Market Status API REST')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidocs', app, document);


  app.setGlobalPrefix("/api/");

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
