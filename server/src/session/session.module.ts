// src/session/session.module.ts
import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule], // Import required modules
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}