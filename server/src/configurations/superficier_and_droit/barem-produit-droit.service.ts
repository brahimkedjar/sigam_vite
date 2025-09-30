import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBaremProduitDroitDto, UpdateBaremProduitDroitDto } from './barem-produit-droit.dto';

@Injectable()
export class BaremProduitDroitService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateBaremProduitDroitDto) {
    try {
      // Check if typePermis exists
      const typePermis = await this.prisma.typePermis.findUnique({
        where: { id: createDto.typePermisId },
      });
      if (!typePermis) {
        throw new BadRequestException(`TypePermis with ID ${createDto.typePermisId} not found`);
      }

      // Check if typeProcedure exists
      const typeProcedure = await this.prisma.typeProcedure.findUnique({
        where: { id: createDto.typeProcedureId },
      });
      if (!typeProcedure) {
        throw new BadRequestException(`TypeProcedure with ID ${createDto.typeProcedureId} not found`);
      }

      const result = await this.prisma.baremProduitetDroit.create({
        data: {
          montant_droit_etab: createDto.montant_droit_etab,
          produit_attribution: createDto.produit_attribution,
          typePermisId: createDto.typePermisId,
          typeProcedureId: createDto.typeProcedureId,
        },
        include: {
          typePermis: {
            select: {
              id: true,
              lib_type: true,
              code_type: true,
            },
          },
          typeProcedure: {
            select: {
              id: true,
              libelle: true,
            },
          },
        },
      });
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException({
        message: 'Failed to create barem produit droit',
        details: error.meta?.cause || error.message,
      });
    }
  }

  async findAll() {
    return this.prisma.baremProduitetDroit.findMany({
      include: {
        typePermis: {
          select: {
            id: true,
            lib_type: true,
            code_type: true,
          },
        },
        typeProcedure: {
          select: {
            id: true,
            libelle: true,
          },
        },
      },
      orderBy: {
        montant_droit_etab: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const entry = await this.prisma.baremProduitetDroit.findUnique({
      where: { id },
      include: {
        typePermis: {
          select: {
            id: true,
            lib_type: true,
            code_type: true,
          },
        },
        typeProcedure: {
          select: {
            id: true,
            libelle: true,
          },
        },
      },
    });

    if (!entry) {
      throw new NotFoundException(`BaremProduitDroit with ID ${id} not found`);
    }

    return entry;
  }

  async update(id: number, updateDto: UpdateBaremProduitDroitDto) {
    try {
      // Check if the entry exists first
      const existingEntry = await this.prisma.baremProduitetDroit.findUnique({
        where: { id },
      });

      if (!existingEntry) {
        throw new NotFoundException(`BaremProduitDroit with ID ${id} not found`);
      }

      // Check if typePermis exists if provided
      if (updateDto.typePermisId) {
        const typePermis = await this.prisma.typePermis.findUnique({
          where: { id: updateDto.typePermisId },
        });
        if (!typePermis) {
          throw new BadRequestException(`TypePermis with ID ${updateDto.typePermisId} not found`);
        }
      }

      // Check if typeProcedure exists if provided
      if (updateDto.typeProcedureId) {
        const typeProcedure = await this.prisma.typeProcedure.findUnique({
          where: { id: updateDto.typeProcedureId },
        });
        if (!typeProcedure) {
          throw new BadRequestException(`TypeProcedure with ID ${updateDto.typeProcedureId} not found`);
        }
      }

      return await this.prisma.baremProduitetDroit.update({
        where: { id },
        data: updateDto,
        include: {
          typePermis: {
            select: {
              id: true,
              lib_type: true,
              code_type: true,
            },
          },
          typeProcedure: {
            select: {
              id: true,
              libelle: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`BaremProduitDroit with ID ${id} not found`);
      }
      throw new BadRequestException({
        message: 'Failed to update barem produit droit',
        details: error.meta?.cause || error.message,
      });
    }
  }

  async remove(id: number) {
    try {
      // Check if the entry exists first
      const existingEntry = await this.prisma.baremProduitetDroit.findUnique({
        where: { id },
      });

      if (!existingEntry) {
        throw new NotFoundException(`BaremProduitDroit with ID ${id} not found`);
      }

      // Delete the barem
      return await this.prisma.baremProduitetDroit.delete({
        where: { id },
        include: {
          typePermis: {
            select: {
              id: true,
              lib_type: true,
            },
          },
          typeProcedure: {
            select: {
              id: true,
              libelle: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`BaremProduitDroit with ID ${id} not found`);
      }
      throw new BadRequestException({
        message: 'Failed to delete barem produit droit',
        details: error.meta?.cause || error.message,
      });
    }
  }
}