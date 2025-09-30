import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDairaDto, UpdateDairaDto } from './dairas.dto';

@Injectable()
export class DairasService {
  constructor(private prisma: PrismaService) {}

  async create(createDairaDto: CreateDairaDto) {
    try {
      return await this.prisma.daira.create({
        data: createDairaDto,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create daira');
    }
  }

  async findAll(wilayaId?: number) {
    const where = wilayaId ? { id_wilaya: wilayaId } : {};
    return this.prisma.daira.findMany({
      where,
      orderBy: { nom_dairaFR: 'asc' },
      include: {
        wilaya: {
          include: {
            antenne: true, // Make sure this is included
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const daira = await this.prisma.daira.findUnique({
      where: { id_daira: id },
      include: {
        wilaya: {
          include: {
            antenne: true, // Make sure this is included
          },
        },
        communes: true,
      },
    });

    if (!daira) {
      throw new NotFoundException(`Daira with ID ${id} not found`);
    }

    return daira;
  }


  async update(id: number, updateDairaDto: UpdateDairaDto) {
    try {
      return await this.prisma.daira.update({
        where: { id_daira: id },
        data: updateDairaDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Daira with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to update daira');
    }
  }

  async remove(id: number) {
    try {
      // Check if there are associated communes before deleting
      const associatedCommunes = await this.prisma.commune.count({
        where: { id_daira: id },
      });

      if (associatedCommunes > 0) {
        throw new BadRequestException(
          'Cannot delete daira with associated communes',
        );
      }

      return await this.prisma.daira.delete({
        where: { id_daira: id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Daira with ID ${id} not found`);
      }
      throw error;
    }
  }
}