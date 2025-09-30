import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubstanceDto, UpdateSubstanceDto } from './substances.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubstancesService {
  constructor(private prisma: PrismaService) {}

  // In your service, add detailed error logging
async create(createSubstanceDto: CreateSubstanceDto) {
  try {
    console.log('Creating substance with data:', createSubstanceDto);
    
    const result = await this.prisma.substance.create({
      data: {
        nom_subFR: createSubstanceDto.nom_subFR,
        nom_subAR: createSubstanceDto.nom_subAR,
        categorie_sub: createSubstanceDto.categorie_sub,
        id_redevance: createSubstanceDto.id_redevance || null,
      },
      include: {
        redevance: true,
      },
    });
    
    console.log('Substance created successfully:', result);
    return result;
    
  } catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Detailed create error:', {
      message: error.message,
      stack: error.stack,
    });
    throw new BadRequestException('Failed to create substance: ' + error.message);
  } else if (typeof error === 'object' && error !== null) {
    console.error('Detailed create error:', error);
    throw new BadRequestException('Failed to create substance');
  } else {
    console.error('Unexpected error:', error);
    throw new BadRequestException('Failed to create substance');
  }
  }}

  async findAll(include?: string) {
    const includeRedevance = include === 'redevance';
    return this.prisma.substance.findMany({
      include: {
        redevance: includeRedevance,
      },
      orderBy: { nom_subFR: 'asc' },
    });
  }

  async findOne(id: number) {
    const substance = await this.prisma.substance.findUnique({
      where: { id_sub: id },
      include: {
        redevance: true,
      },
    });

    if (!substance) {
      throw new NotFoundException(`Substance with ID ${id} not found`);
    }

    return substance;
  }

  async update(id: number, updateSubstanceDto: UpdateSubstanceDto) {
  try {
    return await this.prisma.substance.update({
      where: { id_sub: id },
      data: {
        nom_subFR: updateSubstanceDto.nom_subFR,
        nom_subAR: updateSubstanceDto.nom_subAR,
        categorie_sub: updateSubstanceDto.categorie_sub,
        id_redevance: updateSubstanceDto.id_redevance || null,
      },
      include: {
        redevance: true,
      },
    });
  } catch (error: unknown) {
    // Prisma-specific error handling
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Substance with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to update substance: ' + error.message);
    } else if (error instanceof Error) {
      throw new BadRequestException('Failed to update substance: ' + error.message);
    } else {
      throw new BadRequestException('Failed to update substance');
    }
  }
}

  async remove(id: number) {
  try {
    // Check if there are associated demands before deleting
    const associatedDemands = await this.prisma.substanceAssocieeDemande.count({
      where: { id_substance: id },
    });

    if (associatedDemands > 0) {
      throw new BadRequestException(
        'Cannot delete substance with associated demands',
      );
    }

    return await this.prisma.substance.delete({
      where: { id_sub: id },
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Substance with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to delete substance: ' + error.message);
    } else if (error instanceof Error) {
      throw new BadRequestException('Failed to delete substance: ' + error.message);
    } else {
      throw new BadRequestException('Failed to delete substance');
    }
  }
}
}