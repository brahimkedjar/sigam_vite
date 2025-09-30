import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTypePermisDto, UpdateTypePermisDto } from './types-permis.dto';

// types-permis.service.ts
@Injectable()
export class TypePermisService {
  constructor(private prisma: PrismaService) {}

  async create(createTypePermisDto: CreateTypePermisDto) {
    try {
      // Verify the taxe exists
      const taxeExists = await this.prisma.superficiaireBareme.findUnique({
        where: { id: createTypePermisDto.id_taxe }
      });

      if (!taxeExists) {
        throw new BadRequestException('Invalid taxe ID');
      }

      return await this.prisma.typePermis.create({
        data: {
          lib_type: createTypePermisDto.lib_type,
          code_type: createTypePermisDto.code_type,
          regime: createTypePermisDto.regime,
          duree_initiale: createTypePermisDto.duree_initiale,
          nbr_renouv_max: createTypePermisDto.nbr_renouv_max,
          duree_renouv: createTypePermisDto.duree_renouv,
          delai_renouv: createTypePermisDto.delai_renouv,
          superficie_max: createTypePermisDto.superficie_max,
          id_taxe: createTypePermisDto.id_taxe,
        },
        include: {
          taxe: true
        }
      });

    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Type with this code or label already exists');
      }
      throw new BadRequestException('Failed to create type permis');
    }
  }

  async findAll() {
    return this.prisma.typePermis.findMany({
      orderBy: { lib_type: 'asc' },
      include: {
        taxe: true // Include the taxe relation
      }
    });
  }

  async findOne(id: number) {
    const typePermis = await this.prisma.typePermis.findUnique({
      where: { id },
      include: {
        taxe: true // Include the taxe relation
      }
    });

    if (!typePermis) {
      throw new NotFoundException(`TypePermis with ID ${id} not found`);
    }

    return typePermis;
  }

  async update(id: number, updateTypePermisDto: UpdateTypePermisDto) {
    try {
      // If updating taxe, verify it exists
      if (updateTypePermisDto.id_taxe) {
        const taxeExists = await this.prisma.superficiaireBareme.findUnique({
          where: { id: updateTypePermisDto.id_taxe }
        });

        if (!taxeExists) {
          throw new BadRequestException('Invalid taxe ID');
        }
      }

      return await this.prisma.typePermis.update({
        where: { id },
        data: updateTypePermisDto,
        include: {
          taxe: true
        }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`TypePermis with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to update type permis');
    }
  }

  async remove(id: number) {
    try {
      // Check if there are associated permis before deleting
      const associatedPermis = await this.prisma.permis.count({
        where: { id_typePermis: id },
      });

      if (associatedPermis > 0) {
        throw new BadRequestException(
          'Cannot delete type permis with associated mining titles',
        );
      }

      return await this.prisma.typePermis.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`TypePermis with ID ${id} not found`);
      }
      throw error;
    }
  }
}