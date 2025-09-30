import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAntenneDto, UpdateAntenneDto } from './antennes.dto';

@Injectable()
export class AntennesService {
  constructor(private prisma: PrismaService) {}

  async create(createAntenneDto: CreateAntenneDto) {
    try {
      return await this.prisma.antenne.create({
        data: createAntenneDto,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create antenne');
    }
  }

  async findAll() {
    return this.prisma.antenne.findMany({
      orderBy: { nom: 'asc' },
    });
  }

  async findOne(id: number) {
    const antenne = await this.prisma.antenne.findUnique({
      where: { id_antenne: id },
      include: {
        wilayas: true,
      },
    });

    if (!antenne) {
      throw new NotFoundException(`Antenne with ID ${id} not found`);
    }

    return antenne;
  }

  async update(id: number, updateAntenneDto: UpdateAntenneDto) {
    try {
      return await this.prisma.antenne.update({
        where: { id_antenne: id },
        data: updateAntenneDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Antenne with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to update antenne');
    }
  }

  async remove(id: number) {
    try {
      // Check if there are associated wilayas before deleting
      const associatedWilayas = await this.prisma.wilaya.count({
        where: { id_antenne: id },
      });

      if (associatedWilayas > 0) {
        throw new BadRequestException(
          'Cannot delete antenne with associated wilayas',
        );
      }

      return await this.prisma.antenne.delete({
        where: { id_antenne: id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Antenne with ID ${id} not found`);
      }
      throw error;
    }
  }
}