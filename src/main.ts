import { initializeFirebase } from './../config/firebase.config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as connectFlash from 'connect-flash';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import helmet from 'helmet';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  initializeFirebase(configService);
  app.useGlobalPipes(new ValidationPipe());

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://cdn.jsdelivr.net',
            'https://cdn.tailwindcss.com',
          ],
          imgSrc: [
            "'self'",
            'data:',
            'https://m.media-amazon.com',
            'https://media0.giphy.com',
            'https://res.cloudinary.com',
          ],
        },
      },
    }),
  ); 
  app.enableCors({
    origin: configService.get('cors_url'),
    credentials: true,
  });
  app.use(cookieParser());
  app.use(
    session({
      secret: configService.get('secret'),
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(connectFlash());
  // app.use(
  //   csurf({
  //     cookie: true,
  //     value: (req) => req.cookies['XSRF-TOKEN'],
  //   }),
  // );

  // app.use((req, res, next) => {
  //   const csrfToken = req.csrfToken();
  //   res.cookie('XSRF-TOKEN', csrfToken);
  //   // console.log('Cookies:', req.cookies);
  //   // console.log('CSRF Token:', csrfToken);
  //   next();
  // });
  const config = new DocumentBuilder()
    .setTitle('Ecommerce')
    .setDescription('The Ecommerce Api documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui/index.html', app, document);
  app.useStaticAssets(join(__dirname, '../..', '/public'));
  app.setBaseViewsDir(join(__dirname, '../..', '/views'));
  app.setViewEngine('ejs');
  console.log(configService.get('redis.port'));
  await app.listen(configService.get(<string>'port'), () =>
    console.log(configService.get(<string>'port')),
  );
}
bootstrap();
