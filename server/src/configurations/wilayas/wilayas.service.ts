import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWilayaDto, UpdateWilayaDto } from './wilayas.dto';

@Injectable()
export class WilayasService {
  constructor(private prisma: PrismaService) {}

  async create(createWilayaDto: CreateWilayaDto) {
    try {
      return await this.prisma.wilaya.create({
        data: createWilayaDto,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create wilaya');
    }
  }

  async findAll(antenneId?: number) {
    const where = antenneId ? { id_antenne: antenneId } : {};
    return this.prisma.wilaya.findMany({
      where,
      orderBy: { nom_wilayaFR: 'asc' },
      include: {
        antenne: true,
      },
    });
  }

  async findOne(id: number) {
    const wilaya = await this.prisma.wilaya.findUnique({
      where: { id_wilaya: id },
      include: {
        antenne: true,
        daira: true,
      },
    });

    if (!wilaya) {
      throw new NotFoundException(`Wilaya with ID ${id} not found`);
    }

    return wilaya;
  }

  async update(id: number, updateWilayaDto: UpdateWilayaDto) {
    try {
      return await this.prisma.wilaya.update({
        where: { id_wilaya: id },
        data: updateWilayaDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Wilaya with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to update wilaya');
    }
  }

  async remove(id: number) {
    try {
      // Check if there are associated dairas before deleting
      const associatedDairas = await this.prisma.daira.count({
        where: { id_wilaya: id },
      });

      if (associatedDairas > 0) {
        throw new BadRequestException(
          'Cannot delete wilaya with associated dairas',
        );
      }

      return await this.prisma.wilaya.delete({
        where: { id_wilaya: id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Wilaya with ID ${id} not found`);
      }
      throw error;
    }
  }
}