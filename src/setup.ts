import { ServerConfig } from '@config/server.config';
import { generateSwaggerDocs } from 'src/utils/generate-swagger-docs';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import rateLimit from 'express-rate-limit';
import { GlobalExceptionsFilter } from 'src/core/common/infrastructure/filters/global-exception.filter';

const httpMethods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];

export function getServerConfig(app: INestApplication): ServerConfig {
  const config: ConfigService = app.get(ConfigService);
  return config.get<ServerConfig>('server') || ({} as ServerConfig);
}

export const setupApp = (app: INestApplication) => {
  generateSwaggerDocs(app);

  app.useGlobalFilters(new GlobalExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    methods: httpMethods.join(','),
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 500, // limit each IP to 50 requests per windowMs
      message: 'Has excedido el límite de solicitudes. Intenta más tarde.',
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
};
