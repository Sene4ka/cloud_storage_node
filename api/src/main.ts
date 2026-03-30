import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT', 3000);
  const host = configService.get<string>('SERVER_HOST', '0.0.0.0');

  await app.listen(port, host);
  console.log(`Application is running on: http://${host}:${port}`);
}
bootstrap();