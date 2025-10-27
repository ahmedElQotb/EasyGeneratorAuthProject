import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from './config/config-keys';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import rateLimit from 'express-rate-limit';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  
  const environment = configService.getOrThrow<string>(CONFIG_KEYS.ENVIRONMENT);
  const port = configService.getOrThrow<string>(CONFIG_KEYS.PORT);
  
  logger.log(`Application starting in ${environment} mode`);
  logger.log(`Port: ${port}`);
  
  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // Global rate limiting with express-rate-limit
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
  
  app.use(limiter);
  
  if (environment === 'development') {
    app.enableCors({
      origin: configService.getOrThrow<string>(CONFIG_KEYS.FRONTEND_LOCAL_URL),
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('Easy Generator Auth API')
      .setDescription('API documentation for authentication and content management')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
    
    logger.log(`Swagger docs: http://localhost:${port}/swagger`);
  }
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());
  
  await app.listen(port);
}

bootstrap();
