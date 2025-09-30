import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CapacitesService {
  constructor(private prisma: PrismaService) {}

async saveCapacites(data: any) {
  console.log('Input data to saveCapacites:', JSON.stringify(data, null, 2));

  const id_demande = parseInt(data.id_demande);
  console.log('Parsed id_demande:', id_demande);

  // Validate id_demande
  if (isNaN(id_demande)) {
    console.error('Invalid id_demande: Not a valid number');
    throw new Error('Invalid id_demande: Must be a valid number');
  }

  // Check if the Demande exists
  const demandeExists = await this.prisma.demande.findUnique({
    where: { id_demande },
  });
  console.log('Demande exists for id_demande:', demandeExists ? 'Yes' : 'No', demandeExists);

  if (!demandeExists) {
    console.error('Demande not found for id_demande:', id_demande);
    throw new Error(`Demande with id ${id_demande} not found`);
  }

  // Validate id_expert if provided
  if (data.id_expert) {
    const expertExists = await this.prisma.expertMinier.findUnique({
      where: { id_expert: data.id_expert },
    });
    console.log('Expert exists for id_expert:', data.id_expert, expertExists ? 'Yes' : 'No', expertExists);

    if (!expertExists) {
      console.error('Invalid id_expert: Expert does not exist for id:', data.id_expert);
      throw new Error(`Expert with id ${data.id_expert} does not exist`);
    }
  }

  // Log the data being sent to the update
  const updateData = {
    duree_travaux_estimee: data.duree_travaux,
    capital_social_disponible: parseFloat(data.capital_social),
    budget_prevu: parseFloat(data.budget),
    description_travaux: data.description,
    sources_financement: data.financement,
    date_demarrage_prevue: new Date(data.date_demarrage_prevue),
    id_expert: data.id_expert,
  };
  console.log('Update data for prisma.demande.update:', JSON.stringify(updateData, null, 2));

  // Update the Demande with capacities and selected expert
  try {
    const result = await this.prisma.demande.update({
      where: { id_demande },
      data: updateData,
    });
    console.log('Update successful, result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Error during prisma.demande.update:', error);
    throw error;
  }
}

}
