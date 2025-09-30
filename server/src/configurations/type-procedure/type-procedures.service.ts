import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTypeProcedureDto, UpdateTypeProcedureDto } from './type-procedures.dto';

@Injectable()
export class TypeProceduresService {
  constructor(private prisma: PrismaService) {}

  async create(createTypeProcedureDto: CreateTypeProcedureDto) {
    try {
      return await this.prisma.typeProcedure.create({
        data: createTypeProcedureDto,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create procedure type');
    }
  }

  async findAll() {
    return this.prisma.typeProcedure.findMany({
      orderBy: { libelle: 'asc' },
    });
  }

  async findOne(id: number) {
    const typeProcedure = await this.prisma.typeProcedure.findUnique({
      where: { id },
    });

    if (!typeProcedure) {
      throw new NotFoundException(`TypeProcedure with ID ${id} not found`);
    }

    return typeProcedure;
  }

  async update(id: number, updateTypeProcedureDto: UpdateTypeProcedureDto) {
    try {
      return await this.prisma.typeProcedure.update({
        where: { id },
        data: updateTypeProcedureDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`TypeProcedure with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to update procedure type');
    }
  }

  async remove(id: number) {
  try {
    // ✅ Check if there are associated demandes before deleting
    const associatedDemandes = await this.prisma.demande.count({
      where: { id_typeProc: id },
    });

    if (associatedDemandes > 0) {
      throw new BadRequestException(
        'Cannot delete procedure type with associated demandes',
      );
    }

    return await this.prisma.typeProcedure.delete({
      where: { id },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new NotFoundException(`TypeProcedure with ID ${id} not found`);
    }
    throw error;
  }
}

}