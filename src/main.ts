import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './infrastructure/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Setup Swagger documentation
  setupSwagger(app);

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
  console.log(
    `Swagger documentation available at: http://localhost:3000/api/docs`,
  );
}
void bootstrap();
