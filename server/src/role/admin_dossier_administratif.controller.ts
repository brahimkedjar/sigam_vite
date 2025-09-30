// dossier.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DossierService } from './admin_dossier_administratif.service';
import { DocumentService } from './admin_document.service';
import { TypePermisService } from 'src/demandes/type permis/type_permis.service';
import { TypeProcedureService } from './type-procedure.service';
import { TypeDocService } from './type-doc.service';

@Controller('admin/dossiers')
export class DossierController {
  constructor(
    private readonly dossierService: DossierService,
    private readonly documentService: DocumentService
  ) {}

  @Get()
  async getAllDossiers() {
    return this.dossierService.findAllWithDetails();
  }

  @Post()
  async createDossier(@Body() body: {
    id_typeproc: number;
    id_typePermis: number;
    remarques?: string;
    documents?: {
      nom_doc: string;
      description: string;
      format: string;
      taille_doc: string;
      is_obligatoire?: boolean;
      missing_action?: 'BLOCK_NEXT' | 'REJECT' | 'WARNING';
      reject_message?: string | null;
    }[];
  }) {
    return this.dossierService.create(body);
  }

  @Put(':id')
  async updateDossier(
    @Param('id') id: string,
    @Body() body: {
      remarques?: string;
      documents?: {
        id_doc?: number;
        nom_doc?: string;
        description?: string;
        format?: string;
        taille_doc?: string;
        is_obligatoire?: boolean;
        missing_action?: 'BLOCK_NEXT' | 'REJECT' | 'WARNING';
        reject_message?: string | null;
        action?: 'create' | 'update' | 'delete';
      }[];
    }
  ) {
    return this.dossierService.update(+id, body);
  }

 @Delete(':id')
  async deleteDossier(@Param('id') id: string) {
    return this.dossierService.delete(+id);
  }

  // Document CRUD
  @Get('documents')
  async getAllDocuments() {
    return this.documentService.findAll();
  }

  
  @Post('documents')
  async createDocument(@Body() body: {
    nom_doc: string;
    description: string;
    format: string;
    taille_doc: string;
  }) {
    return this.documentService.create(body);
  }

  // Document management
  @Post(':id/documents')
  async addDocumentToDossier(
    @Param('id') dossierId: string,
    @Body() body: {
      id_doc: number;
      is_obligatoire?: boolean;
      missing_action?: 'BLOCK_NEXT' | 'REJECT' | 'WARNING';
      reject_message?: string | null;
    }
  ) {
    return this.dossierService.addDocument(+dossierId, body.id_doc, {
      is_obligatoire: body.is_obligatoire,
      missing_action: body.missing_action,
      reject_message: body.reject_message,
    });
  }

  @Delete(':id/documents/:docId')
  async removeDocumentFromDossier(
    @Param('id') dossierId: string,
    @Param('docId') docId: string
  ) {
    return this.dossierService.removeDocument(+dossierId, +docId);
  }

  @Put('documents/:id')
  async updateDocument(
    @Param('id') id: string,
    @Body() body: {
      nom_doc?: string;
      description?: string;
      format?: string;
      taille_doc?: string;
    }
  ) {
    return this.documentService.update(+id, body);
  }

  @Delete('documents/:id')
  async deleteDocument(@Param('id') id: string) {
    return this.documentService.delete(+id);
  }
}

@Controller('type-permis')
export class TypePermisController {
  constructor(private readonly typePermisService: TypePermisService) {}

  @Get()
  findAll() {
    return this.typePermisService.findAll();
  }
}
@Controller('type-procedures')
export class TypeProcedureController {
  constructor(private readonly typeProcedureService: TypeProcedureService) {}

  @Get()
  findAll() {
    return this.typeProcedureService.findAll();
  }
}

@Controller('type-docs')
export class TypeDocController {
  constructor(private readonly typeDocService: TypeDocService) {}

  @Get()
  findAll() {
    return this.typeDocService.findAll();
  }
}
