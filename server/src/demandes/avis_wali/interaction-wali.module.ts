import { Module } from '@nestjs/common';
import { InteractionWaliController } from './interaction-wali.controller';
import { InteractionWaliService } from './interaction-wali.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InteractionWaliController],
  providers: [InteractionWaliService],
})
export class InteractionWaliModule {}
