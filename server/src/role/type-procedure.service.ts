import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TypeProcedureService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.typeProcedure.findMany();
  }
}
