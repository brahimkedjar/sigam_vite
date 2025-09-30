import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSuperficiaireBaremeDto, UpdateSuperficiaireBaremeDto } from './superficiaire-bareme.dto';

@Injectable()
export class SuperficiaireBaremeService {
  constructor(private prisma: PrismaService) {}

async create(createDto: CreateSuperficiaireBaremeDto) {
  try {
    console.log('Sending to Prisma.create() with data:');
    console.dir({
      droit_fixe: createDto.droit_fixe,
      periode_initiale: createDto.periode_initiale,
      premier_renouv: createDto.premier_renouv,
      autre_renouv: createDto.autre_renouv,
      devise: createDto.devise,
    }, { depth: null });

    const result = await this.prisma.superficiaireBareme.create({
      data: {
        droit_fixe: createDto.droit_fixe,
        periode_initiale: createDto.periode_initiale,
        premier_renouv: createDto.premier_renouv,
        autre_renouv: createDto.autre_renouv,
        devise: createDto.devise,
      },
    });

    return result;

  } catch (error) {
    // 🔴 Log full error before throwing
    console.error('❌ Error while creating superficiaire bareme:', error);
    if ((error as any).stack) {
      console.error('Stack trace:', (error as any).stack);
    }

    throw new BadRequestException({
      message: 'Failed to create superficiaire bareme',
      details: (error as any).meta || error.message || error,
    });
  }
}



  async findAll() {
    return this.prisma.superficiaireBareme.findMany({
      select: {
        id: true,
        droit_fixe: true,
        periode_initiale: true,
        premier_renouv: true,
        autre_renouv: true,
        devise: true,
      },
      orderBy: {
        droit_fixe: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const entry = await this.prisma.superficiaireBareme.findUnique({
      where: { id },
      select: {
        id: true,
        droit_fixe: true,
        periode_initiale: true,
        premier_renouv: true,
        autre_renouv: true,
        devise: true,
      },
    });

    if (!entry) {
      throw new NotFoundException(`SuperficiaireBareme with ID ${id} not found`);
    }

    return entry;
  }

  async update(id: number, updateDto: UpdateSuperficiaireBaremeDto) {
    try {
      return await this.prisma.superficiaireBareme.update({
        where: { id },
        data: updateDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`SuperficiaireBareme with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to update superficiaire bareme');
    }
  }

  async remove(id: number) {
  try {
    // 1. First, find all TypePermis that reference this taxe
    const relatedTypePermis = await this.prisma.typePermis.findMany({
      where: { id_taxe: id },
      select: { id: true }
    });

    const typePermisIds = relatedTypePermis.map(tp => tp.id);

    // 2. Check if there are any BaremProduitetDroit that reference these TypePermis
    if (typePermisIds.length > 0) {
      const associatedBarems = await this.prisma.baremProduitetDroit.count({
        where: { typePermisId: { in: typePermisIds } },
      });

      if (associatedBarems > 0) {
        throw new BadRequestException(
          'Cannot delete taxe because it has associated barems. Delete the barems first.'
        );
      }
    }

    // 3. Check if there are other relationships (Demande, DossierAdministratif, Permis, etc.)
    // that might prevent deletion of TypePermis
    if (typePermisIds.length > 0) {
      const [associatedDemandes, associatedDossiers, associatedPermis] = await Promise.all([
        this.prisma.demande.count({ where: { id_typePermis: { in: typePermisIds } } }),
        this.prisma.dossierAdministratif.count({ where: { id_typePermis: { in: typePermisIds } } }),
        this.prisma.permis.count({ where: { id_typePermis: { in: typePermisIds } } })
      ]);

      if (associatedDemandes > 0 || associatedDossiers > 0 || associatedPermis > 0) {
        throw new BadRequestException(
          'Cannot delete taxe because it has associated demandes, dossiers, or permits. Delete those first.'
        );
      }
    }

    // 4. Now we can safely delete the TypePermis that reference this taxe
    if (typePermisIds.length > 0) {
      await this.prisma.typePermis.deleteMany({
        where: { id_taxe: id },
      });
    }

    // 5. Finally delete the SuperficiaireBareme
    return await this.prisma.superficiaireBareme.delete({
      where: { id },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new NotFoundException(`SuperficiaireBareme with ID ${id} not found`);
    }
    
    // Handle our custom BadRequestException
    if (error instanceof BadRequestException) {
      throw error;
    }
    
    // Handle other Prisma errors
    if (error.code === 'P2003') {
      throw new BadRequestException(
        'Cannot delete taxe due to foreign key constraints. There may be related records that need to be deleted first.'
      );
    }
    
    throw error;
  }
}

}