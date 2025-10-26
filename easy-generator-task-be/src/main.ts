import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from './config/config-keys';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  const environment = configService.getOrThrow<string>(CONFIG_KEYS.ENVIRONMENT);
  
  if (environment === 'development') {
    app.enableCors({
      origin: configService.getOrThrow<string>(CONFIG_KEYS.FRONTEND_LOCAL_URL),
      credentials: true,
    });
  }
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());
  
  await app.listen(configService.getOrThrow<string>(CONFIG_KEYS.PORT));
}

bootstrap();
