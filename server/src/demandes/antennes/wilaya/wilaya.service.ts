// wilaya.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateWilayaDto, UpdateWilayaDto } from '../file.dto';

@Injectable()
export default class WilayaService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.wilaya.findMany({
      include: {
        antenne: true,
      },
      orderBy: {
        code_wilaya: 'asc',
      },
    });
  }

  async findByAntenne(idAntenne: number) {
    return this.prisma.wilaya.findMany({
      where: { id_antenne: idAntenne },
      orderBy: {
        code_wilaya: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.wilaya.findUnique({
      where: { id_wilaya: id },
      include: {
        antenne: true,
        daira: {
          include: {
            communes: true,
          },
        },
      },
    });
  }

  async findByCode(code: string) {
    return this.prisma.wilaya.findUnique({
      where: { code_wilaya: code },
    });
  }

  async findDairasByWilaya(id: number) {
    return this.prisma.daira.findMany({
      where: { id_wilaya: id },
      orderBy: {
        nom_dairaFR: 'asc',
      },
    });
  }

  async create(createWilayaDto: CreateWilayaDto) {
    return this.prisma.wilaya.create({
      data: {
        ...createWilayaDto,
      },
    });
  }

  async update(id: number, updateWilayaDto: UpdateWilayaDto) {
    return this.prisma.wilaya.update({
      where: { id_wilaya: id },
      data: updateWilayaDto,
    });
  }

  async remove(id: number) {
    return this.prisma.wilaya.delete({
      where: { id_wilaya: id },
    });
  }
}