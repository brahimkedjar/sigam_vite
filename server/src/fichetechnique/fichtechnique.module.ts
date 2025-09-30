import { Module } from '@nestjs/common';
import { ProceduretechniqueController } from './procedure.controller';

ProceduretechniqueController
@Module({
  controllers: [ProceduretechniqueController],
  providers: []
})
export class ProceduretechniqueModule {}

