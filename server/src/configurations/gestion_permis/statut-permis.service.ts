// src/statut-permis/statut-permis.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatutPermisService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.statutPermis.findMany({
      orderBy: { lib_statut: 'asc' },
    });
  }

  async findOne(id: number) {
    const statutPermis = await this.prisma.statutPermis.findUnique({
      where: { id },
    });

    if (!statutPermis) {
      throw new NotFoundException(`StatutPermis with ID ${id} not found`);
    }

    return statutPermis;
  }
}