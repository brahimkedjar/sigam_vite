// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PermissionsGuard } from './permissions.guard';
import { Reflector } from '@nestjs/core';
import { SessionModule } from '../session/session.module'; // Add this import
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    SessionModule, // Add this line
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    AuditLogModule,
  ],
  providers: [
    AuthService,
    PrismaService,
    Reflector,
    PermissionsGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}