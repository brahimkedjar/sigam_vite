// document.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.document.findMany();
  }

  async create(data: {
    nom_doc: string;
    description: string;
    format: string;
    taille_doc: string;
  }) {
    return this.prisma.document.create({ data });
  }

  async update(id: number, data: {
    nom_doc?: string;
    description?: string;
    format?: string;
    taille_doc?: string;
  }) {
    return this.prisma.document.update({
      where: { id_doc: id },
      data
    });
  }

  async delete(id: number) {
    return this.prisma.$transaction(async (prisma) => {
      // First remove from all dossiers
      await prisma.dossierDocument.deleteMany({
        where: { id_doc: id }
      });
      
      // Then delete the document
      return prisma.document.delete({
        where: { id_doc: id }
      });
    });
  }
}