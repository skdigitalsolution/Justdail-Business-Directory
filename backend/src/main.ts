import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Parse HttpOnly cookies for session handling
  app.use(cookieParser());

  // Global routing prefix
  app.setGlobalPrefix('api/v1');

  // Strict CORS policy for frontend client
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin: [corsOrigin, 'http://127.0.0.1:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation & error formatting pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger OpenAPI documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Business Directory Platform API')
    .setDescription('Core RESTful API documentation with OTP Authentication & RBAC for Justdial-inspired Platform')
    .setVersion('1.0.0')
    .addTag('Health', 'System and database health diagnostics')
    .addTag('Authentication', 'Indian Mobile OTP authentication and session management')
    .addTag('Users', 'User profile management')
    .addTag('Roles & Access Control', 'Role-based access control and system permissions')
    .addCookieAuth('auth_session')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
  await app.listen(port);

  logger.log(`====================================================`);
  logger.log(`🚀 Backend API running on: http://localhost:${port}/api/v1`);
  logger.log(`📚 Swagger documentation at: http://localhost:${port}/api/docs`);
  logger.log(`====================================================`);
}

bootstrap();
