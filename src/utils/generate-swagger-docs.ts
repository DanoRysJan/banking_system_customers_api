import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function generateSwaggerDocs(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Bank Customers API')
    .setDescription('Hexagonal Architecture  + CQRS Backend')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}
