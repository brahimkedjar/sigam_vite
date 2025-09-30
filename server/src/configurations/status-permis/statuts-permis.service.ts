import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStatutPermisDto, UpdateStatutPermisDto } from './statuts-permis.dto';

@Injectable()
export class StatutPermisService {
  constructor(private prisma: PrismaService) {}

  async create(createStatutPermisDto: CreateStatutPermisDto) {
    try {
      return await this.prisma.statutPermis.create({
        data: {
          lib_statut: createStatutPermisDto.lib_statut,
          description: createStatutPermisDto.description
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create mining title status');
    }
  }

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

  async update(id: number, updateStatutPermisDto: UpdateStatutPermisDto) {
    try {
      return await this.prisma.statutPermis.update({
        where: { id },
        data: updateStatutPermisDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`StatutPermis with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to update mining title status');
    }
  }

  async remove(id: number) {
    try {
      // Check if there are associated permis before deleting
      const associatedPermis = await this.prisma.permis.count({
        where: { id_statut: id },
      });

      if (associatedPermis > 0) {
        throw new BadRequestException(
          'Cannot delete status with associated mining titles',
        );
      }

      return await this.prisma.statutPermis.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`StatutPermis with ID ${id} not found`);
      }
      throw error;
    }
  }
}