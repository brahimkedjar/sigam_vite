import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExpertDto } from './create-expert.dto';
import { UpdateExpertDto } from './update-expert.dto';
import { ExpertResponseDto } from './expert-response.dto';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class ExpertMinierService {
  constructor(private readonly prisma: PrismaService, private notificationsService: NotificationsService,) {}

  async create(createExpertDto: CreateExpertDto): Promise<ExpertResponseDto> {
  const expert = await this.prisma.expertMinier.create({
    data: {
      ...createExpertDto,
      date_agrement: new Date(createExpertDto.date_agrement), 
    },
  });
  await this.notificationsService.createExpertNotification(expert, 'expert_created');
  return this.toResponseDto(expert);
}


  async findAll(): Promise<ExpertResponseDto[]> {
    const experts = await this.prisma.expertMinier.findMany();
    return experts.map(this.toResponseDto);
  }

  async findOne(id: number): Promise<ExpertResponseDto> {
    const expert = await this.prisma.expertMinier.findUnique({
      where: { id_expert: id },
    });
    return this.toResponseDto(expert);
  }

  async update(id: number, updateExpertDto: UpdateExpertDto): Promise<ExpertResponseDto> {
  const updatedExpert = await this.prisma.expertMinier.update({
    where: { id_expert: id },
    data: {
      ...updateExpertDto,
      date_agrement: updateExpertDto.date_agrement 
        ? new Date(updateExpertDto.date_agrement) // ✅ convert only if present
        : undefined,
    },
  });
  return this.toResponseDto(updatedExpert);
}


  async remove(id: number): Promise<void> {
    await this.prisma.expertMinier.delete({
      where: { id_expert: id },
    });
  }

  private toResponseDto(expert: any): ExpertResponseDto {
    return {
      id_expert: expert.id_expert,
      nom_expert: expert.nom_expert,
      num_agrement: expert.num_agrement,
      date_agrement: expert.date_agrement,
      etat_agrement: expert.etat_agrement,
      adresse: expert.adresse,
      email: expert.email,
      tel_expert: expert.tel_expert,
      fax_expert: expert.fax_expert,
      specialisation: expert.specialisation,
    };
  }

  async importFromCsvSimple(csvData: string): Promise<number> {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    let importedCount = 0;
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(value => value.trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      try {
        const expertData: CreateExpertDto = {
          nom_expert: row.nom_expert || row.nom || row.name || '',
          num_agrement: row.num_agrement || row.agrement || row.numero_agrement || '',
date_agrement: row.date_agrement 
  ? row.date_agrement.split('T')[0]  
  : new Date().toISOString().split('T')[0],  
          etat_agrement: row.etat_agrement || row.etat || row.status || '',
          adresse: row.adresse || row.address || '',
          email: row.email || row.mail || '',
          tel_expert: row.tel_expert || row.telephone || row.phone || '',
          fax_expert: row.fax_expert || row.fax || '',
          specialisation: row.specialisation || row.specialty || '',
        };

        if (!expertData.nom_expert || !expertData.num_agrement || !expertData.etat_agrement) {
          continue;
        }

        const existingExpert = await this.prisma.expertMinier.findFirst({
          where: {
            nom_expert: expertData.nom_expert,
            num_agrement: expertData.num_agrement,
          },
        });

        if (existingExpert) {
          await this.prisma.expertMinier.update({
            where: { id_expert: existingExpert.id_expert },
            data: expertData,
          });
        } else {
          await this.prisma.expertMinier.create({
            data: expertData,
          });
        }

        importedCount++;
      } catch (error) {
        console.error('Error importing row:', error);
      }
    }
    
    return importedCount;
  }
}