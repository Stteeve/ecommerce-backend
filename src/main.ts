import './polyfills';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('✅ App version: 2025-06-03-01');

  const app = await NestFactory.create(AppModule);
  await app.listen(80, '0.0.0.0');
}
bootstrap();
