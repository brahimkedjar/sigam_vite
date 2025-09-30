import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TypeDocService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.document.findMany();
  }
}
