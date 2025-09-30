// src/type-permis/type-permis.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TypePermisService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.typePermis.findMany({
      orderBy: { lib_type: 'asc' },
    });
  }

  async findOne(id: number) {
    const typePermis = await this.prisma.typePermis.findUnique({
      where: { id },
    });

    if (!typePermis) {
      throw new NotFoundException(`TypePermis with ID ${id} not found`);
    }

    return typePermis;
  }
}