import { GeneratePermisService } from './permis.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PdfGeneratorService } from './generate_permis_pdf.service';
import { Controller, Get, Param, Post, ParseIntPipe, Query, Body, Res,Patch, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express'; // ✅ add this


@Controller('api/permis')
export class GeneratePermisController {
  constructor( private readonly pdfService: PdfGeneratorService,private service: GeneratePermisService,private readonly prisma: PrismaService
) {}

@Patch('templates/:id')
async renameTemplate(
  @Param('id') id: string,
  @Body() body: { name: string }
) {
  try {
    const template = await this.prisma.permisTemplate.update({
      where: { id: parseInt(id) },
      data: { name: body.name }
    });
    
    return template;
  } catch (error) {
    console.error('Error renaming template:', error);
    throw new HttpException('Failed to rename template', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  @Post('generate/:id')
  async generatePermis(@Param('id') id: string) {
    return this.service.generatePermisFromDemande(parseInt(id));
  }

  @Get('summary/:id')
  async getPdfData(@Param('id', ParseIntPipe) id: number) {
    return this.service.getPermisPdfInfo(id);
  }

   @Post('generate-pdf')
  async generatePdf(@Body() design: any, @Res() res: Response) {
    try {
      const pdfBuffer = await this.pdfService.generatePdf(design);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=permis-${design.data.code_demande}.pdf`,
      });
      
      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  }


/* @Get('templates')
async getTemplates(
  @Query('permisId') code_permis?: string
) {
  return this.service.getTemplates(
    code_permis ? (code_permis) : undefined
  );
}*/

  /*@Post('templates')
async saveTemplate(@Body() body: any) {
  const result = await this.service.saveTemplate(body);
  return result; // Return the full template with id
}*/

@Delete('templates/:id')
async deleteTemplate(@Param('id') id: string) {
  return this.service.deleteTemplate(id);
}


@Post('save-permis')
async savePermis(@Body() body: any) {
  // First create the permis
  const permis = await this.service.generatePermisFromDemande(body.id_demande);
  
  return { 
    id: permis.id,
    code_permis: permis.code_permis
  };
}

// Save just the template (can be called after permis is created)
@Post('save-template')
async saveTemplate(@Body() body: any) {
  const { elements, permisId, templateId, name } = body;
  
  const template = await this.service.saveTemplate({
    elements,
    permisId,
    templateId,
    name
  });
  
  return template;
}

// In your GeneratePermisController
@Get('procedure/:idProc/permis')
async getPermisByProcedure(@Param('idProc') idProc: string) { // Change to string
  try {
    // Convert idProc to number
    const procedureId = parseInt(idProc, 10);
    if (isNaN(procedureId)) {
      return { exists: false, error: 'Invalid procedure ID' };
    }
    
    // First get the demande associated with this procedure
    const procedure = await this.prisma.procedure.findUnique({
      where: { 
        id_proc: procedureId // Use the converted number
      },
      include: { 
        demandes: true 
      }
    });
    
    if (!procedure || procedure.demandes.length === 0) {
      return { exists: false };
    }
    
    const demandeId = procedure.demandes[0].id_demande;
    
    // Check if a permis already exists for this demande
    const permis = await this.prisma.permis.findFirst({
      where: { 
        permisProcedure: {
          some: {
            id_proc: procedureId
          }
        }
      }
    });
    
    return { 
      exists: !!permis, 
      permisId: permis?.id || null,
      permisCode: permis?.code_permis || null
    };
  } catch (error) {
    console.error('Error checking permis:', error);
    return { exists: false, error: 'Internal server error' };
  }
}

@Get(':permisId/templates')
async getTemplatesByPermis(@Param('permisId', ParseIntPipe) permisId: number) {
  try {
    const templates = await this.prisma.permisTemplate.findMany({
      where: { 
        permisId: permisId 
      },
      orderBy: { 
        createdAt: 'desc' 
      }
    });
    
    return templates;
  } catch (error) {
    console.error('Error fetching templates by permis:', error);
    throw new HttpException('Failed to fetch templates', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
}
