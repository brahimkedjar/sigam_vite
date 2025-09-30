//C:\Users\A\Desktop\sigam-project\client\pages\seances\seances_type.ts
const apiURL = process.env.NEXT_PUBLIC_API_URL;

export interface Member {
  id_membre: number;
  nom_membre: string;
  prenom_membre: string;
  fonction_membre: string;
}

export interface Procedure {
  id_proc: number;
  num_proc: string;
  date_debut: Date;
  detenteur: string;
  type: string;
}

export interface Seance {
  id_seance: number;
  detenteur: string;
  num_seance: string;
  date_seance: Date;
  exercice: number;
  statut: 'programmee' | 'terminee';
  membres: Member[];
  procedures: Procedure[];
  remarques?: string;
}

interface CreateSeanceData {
  num_seance: string;
  date_seance: Date;
  exercice: number;
  membresIds: number[];
  proceduresIds: number[];
  statut: 'programmee' | 'terminee';
  remarques?: string;
}

// Check if we're in the browser (client-side)
function isBrowser() {
  return typeof window !== 'undefined';
}

export async function getSeances(): Promise<Seance[]> {
  // Don't run during build (server-side)
  if (!isBrowser()) return [];
  
  const response = await fetch(`${apiURL}/api/seances`);
  if (!response.ok) throw new Error('Failed to fetch seances');
  
  const data = await response.json();
  
  return data.map((s: any) => ({
    ...s,
    date_seance: new Date(s.date_seance), 
  }));
}

export async function getNextSeanceNumber(): Promise<string> {
  if (!isBrowser()) return "SE-000";
  
  const response = await fetch(`${apiURL}/api/seances/next-number`);
  if (!response.ok) throw new Error('Failed to fetch next seance number');
  const data = await response.json();
  return data.nextSeanceNumber;
}

export async function createSeance(seanceData: CreateSeanceData): Promise<Seance> {
  const response = await fetch(`${apiURL}/api/seances`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(seanceData),
  });
  if (!response.ok) throw new Error('Failed to create seance');
  return response.json();
}

export async function updateSeance(id: number, seanceData: CreateSeanceData): Promise<Seance> {
  const response = await fetch(`${apiURL}/api/seances/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(seanceData),
  });
  if (!response.ok) throw new Error('Failed to update seance');
  return response.json();
}

export async function deleteSeance(id: number): Promise<void> {
  const response = await fetch(`${apiURL}/api/seances/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete seance');
}

export async function getMembers(): Promise<Member[]> {
  if (!isBrowser()) return [];
  
  const response = await fetch(`${apiURL}/api/seances/membres-comite`);
  if (!response.ok) throw new Error('Failed to fetch members');
  return response.json();
}

export async function getProcedures(search = '', page = 1): Promise<Procedure[]> {
  // Don't run during build (server-side)
  if (!isBrowser()) return [];
  
  try {
    const response = await fetch(
      `${apiURL}/api/seances/procedures?search=${encodeURIComponent(search)}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch procedures');
    }
    
    const data = await response.json();
    return data.map((proc: any) => ({
      id_proc: proc.id_proc,
      num_proc: proc.num_proc,
      type: proc.typeProcedure?.libelle || 'N/A',
      detenteur: proc.demandes?.[0]?.detenteur?.nom_societeFR || 'N/A',
      date_debut: proc.date_debut ? new Date(proc.date_debut) : new Date()
    }));
  } catch (error) {
    console.error('Error in getProcedures:', error);
    return [];
  }
}