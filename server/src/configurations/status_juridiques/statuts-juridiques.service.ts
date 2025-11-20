import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStatutJuridiqueDto, UpdateStatutJuridiqueDto } from './statuts-juridiques.dto';

@Injectable()
export class StatutsJuridiquesService {
  constructor(private prisma: PrismaService) {}

  async create(createStatutJuridiqueDto: CreateStatutJuridiqueDto) {
    try {
      return await this.prisma.statutJuridique.create({
        data: createStatutJuridiqueDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Code statut must be unique');
      }
      throw new BadRequestException('Failed to create legal status');
    }
  }

  async findAll() {
    return this.prisma.statutJuridique.findMany({
      orderBy: { statut_fr: 'asc' },
    });
  }

  async findOne(id: number) {
    const statut = await this.prisma.statutJuridique.findUnique({
      where: { id_statutJuridique: id },
    });

    if (!statut) {
      throw new NotFoundException(`Legal status with ID ${id} not found`);
    }

    return statut;
  }

  async update(id: number, updateStatutJuridiqueDto: UpdateStatutJuridiqueDto) {
    try {
      return await this.prisma.statutJuridique.update({
        where: { id_statutJuridique: id },
        data: updateStatutJuridiqueDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Legal status with ID ${id} not found`);
      }
      if (error.code === 'P2002') {
        throw new BadRequestException('Code statut must be unique');
      }
      throw new BadRequestException('Failed to update legal status');
    }
  }

  async remove(id: number) {
    try {
      // Check if there are associated detenteurs before deleting.
      // With the new many-to-many relation, the link is stored in FormeJuridiqueDetenteur.
      const associatedDetenteurs = await this.prisma.formeJuridiqueDetenteur.count({
        where: { id_statut: id },
      });

      if (associatedDetenteurs > 0) {
        throw new BadRequestException(
          'Cannot delete legal status with associated holders',
        );
      }

      return await this.prisma.statutJuridique.delete({
        where: { id_statutJuridique: id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Legal status with ID ${id} not found`);
      }
      throw error;
    }
  }
}
