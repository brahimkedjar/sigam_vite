// src/type-permis/type-permis.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTypePermisDto } from './type-permis.dto';
import { TypePermis } from '@prisma/client';

@Injectable()
export class TypePermisService {
  constructor(private prisma: PrismaService) {}

  async createTypePermis(data: CreateTypePermisDto): Promise<TypePermis> {
    return this.prisma.typePermis.create({
      data: {
        ...data,
        code_type: data.code_type.toUpperCase()
      }
    });
  }

  async findAll(): Promise<TypePermis[]> {
    return this.prisma.typePermis.findMany();
  }

  async getPermisDetails(id: number): Promise<TypePermis | null> {
    return this.prisma.typePermis.findUnique({
      where: { id }
    });
  }
}