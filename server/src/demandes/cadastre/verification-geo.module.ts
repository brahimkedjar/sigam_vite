import { Module } from '@nestjs/common';
import { VerificationGeoController } from './verification-geo.controller';
import { VerificationGeoService } from './verification-geo.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [VerificationGeoController],
  providers: [VerificationGeoService, PrismaService],
})
export class VerificationGeoModule {}

