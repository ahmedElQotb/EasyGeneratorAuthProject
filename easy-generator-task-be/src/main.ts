import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from './config/config-keys';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  const environment = configService.getOrThrow<string>(CONFIG_KEYS.ENVIRONMENT);
  
  if (environment === 'development') {
    app.enableCors({
      origin: configService.getOrThrow<string>(CONFIG_KEYS.FRONTEND_LOCAL_URL),
      credentials: true,
    });

    // Swagger setup
    const config = new DocumentBuilder()
      .setTitle('Easy Generator Auth API')
      .setDescription('API documentation for authentication and content management')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());
  
  await app.listen(configService.getOrThrow<string>(CONFIG_KEYS.PORT));
}

bootstrap();
