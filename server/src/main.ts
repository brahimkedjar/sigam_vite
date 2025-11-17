import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as fs from 'fs';
if (!global.crypto?.subtle) {
  const { webcrypto } = require('crypto');
  (global as any).crypto = webcrypto;
}
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: ['http://localhost:3001','http://localhost:5174','http://localhost:5173'],
    credentials: true,
    exposedHeaders: ['set-cookie', 'authorization'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Cache-Control',
      'x-user-id',
      'x-user-name'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH','HEAD'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // ✅ Serving static files from public
  const publicPath = join(process.cwd(), 'server', 'public');
  if (!fs.existsSync(publicPath)) {
    console.warn('⚠️ Warning: public folder not found at:', publicPath);
  }
  app.useStaticAssets(publicPath);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
