import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config} from './config/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Techinnover E-commerce API')
    .setDescription('Techinnover API for managing an e-commerce system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api docs', app, document);

  app.enableCors();

  await app.listen(config.web.port, '0.0.0.0');
}
bootstrap();
