import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const session = require('express-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: false,
        sameSite: 'lax',
      },
    }),
  );

  app.enableCors({
    origin: ['http://localhost:3000', 'http://192.168.1.2:3000'],
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
