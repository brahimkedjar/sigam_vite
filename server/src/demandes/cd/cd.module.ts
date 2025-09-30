import { Module } from '@nestjs/common';
import { CdController } from './cd.controller';
import { CdService } from './cd.service';

@Module({
  controllers: [CdController],
  providers: [CdService]
})
export class ComiteDirectionModule {}

