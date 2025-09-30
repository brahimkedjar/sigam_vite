import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommuneDto, UpdateCommuneDto } from './communes.dto';

@Injectable()
export class CommunesService {
  constructor(private prisma: PrismaService) {}

  async create(createCommuneDto: CreateCommuneDto) {
    try {
      return await this.prisma.commune.create({
        data: createCommuneDto,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create commune');
    }
  }

  async findAll(dairaId?: number) {
    const where = dairaId ? { id_daira: dairaId } : {};
    return this.prisma.commune.findMany({
      where,
      orderBy: { nom_communeFR: 'asc' },
      include: {
        daira: {
          include: {
            wilaya: {
              include: {
                antenne: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const commune = await this.prisma.commune.findUnique({
      where: { id_commune: id },
      include: {
        daira: {
          include: {
            wilaya: {
              include: {
                antenne: true,
              },
            },
          },
        },
      },
    });

    if (!commune) {
      throw new NotFoundException(`Commune with ID ${id} not found`);
    }

    return commune;
  }

  async update(id: number, updateCommuneDto: UpdateCommuneDto) {
    try {
      return await this.prisma.commune.update({
        where: { id_commune: id },
        data: updateCommuneDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Commune with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to update commune');
    }
  }

  async remove(id: number) {
    try {
      // Check if there are associated demandes before deleting
      const associatedDemandes = await this.prisma.demande.count({
        where: { id_commune: id },
      });

      if (associatedDemandes > 0) {
        throw new BadRequestException(
          'Cannot delete commune with associated demandes',
        );
      }

      return await this.prisma.commune.delete({
        where: { id_commune: id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Commune with ID ${id} not found`);
      }
      throw error;
    }
  }
}