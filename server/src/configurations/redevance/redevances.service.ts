import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRedevanceDto, UpdateRedevanceDto } from './redevances.dto';

@Injectable()
export class RedevancesService {
  constructor(private prisma: PrismaService) {}

  async create(createRedevanceDto: CreateRedevanceDto) {
    try {
      return await this.prisma.redevanceBareme.create({
        data: createRedevanceDto,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create royalty rate');
    }
  }

  async findAll() {
    return this.prisma.redevanceBareme.findMany({
      orderBy: { description: 'asc' },
    });
  }

  async findOne(id: number) {
    const redevance = await this.prisma.redevanceBareme.findUnique({
      where: { id_redevance: id },
    });

    if (!redevance) {
      throw new NotFoundException(`Royalty rate with ID ${id} not found`);
    }

    return redevance;
  }

  async update(id: number, updateRedevanceDto: UpdateRedevanceDto) {
    try {
      return await this.prisma.redevanceBareme.update({
        where: { id_redevance: id },
        data: updateRedevanceDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Royalty rate with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to update royalty rate');
    }
  }

  async remove(id: number) {
    try {
      // Check if there are associated substances before deleting
      const associatedSubstances = await this.prisma.substance.count({
        where: { id_redevance: id },
      });

      if (associatedSubstances > 0) {
        throw new BadRequestException(
          'Cannot delete royalty rate with associated substances',
        );
      }

      return await this.prisma.redevanceBareme.delete({
        where: { id_redevance: id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Royalty rate with ID ${id} not found`);
      }
      throw error;
    }
  }
}