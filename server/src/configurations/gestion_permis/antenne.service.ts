// src/antenne/antenne.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AntenneService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.antenne.findMany({
      orderBy: { nom: 'asc' },
    });
  }

  async findOne(id: number) {
    const antenne = await this.prisma.antenne.findUnique({
      where: { id_antenne: id },
    });

    if (!antenne) {
      throw new NotFoundException(`Antenne with ID ${id} not found`);
    }

    return antenne;
  }
}