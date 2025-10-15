import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.use((req, res, next) => {
    if (req.originalUrl === '/payments/webhook') {
      bodyParser.raw({ type: 'application/json' })(req, res, next);
    } else {
      next();
    }
  });

  const config = new DocumentBuilder()
    .setTitle('AdStreet API')
    .setDescription('API Specification for AdStreet, a digital marketplace connecting print shops and advertising agencies.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

