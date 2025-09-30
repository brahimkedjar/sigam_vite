import { Module } from '@nestjs/common';
import { TypePermisController } from './type_permis.controller';
import { TypePermisService } from './type_permis.service';

@Module({
  controllers: [TypePermisController],
  providers: [TypePermisService],
  
})
export class TypePermisModule {}
