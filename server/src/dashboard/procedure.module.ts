import { Module } from '@nestjs/common';
import { ProcedureController } from './procedure.controller';
import { ProcedureService } from './procedure.service';

@Module({
  controllers: [ProcedureController],
  providers: [ProcedureService]
})
export class ProcedureModule {}

