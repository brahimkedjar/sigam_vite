'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from '@/src/hooks/useSearchParams';
import styles from './CahierCharges.module.css';
import jsPDF from 'jspdf';

interface CahierDesCharges {
  id: number;
  id_demande: number;
  num_cdc: string;
  dateExercice: string;
  fuseau?: string;
  typeCoordonnees?: string;
  natureJuridique?: string;
  vocationTerrain?: string;
  nomGerant?: string;
  personneChargeTrxx?: string;
  qualification?: string;
  reservesGeologiques?: number | null;
  reservesExploitables?: number | null;
  volumeExtraction?: string;
  dureeExploitation?: string;
  methodeExploitation?: string;
  dureeTravaux?: string;
  dateDebutTravaux?: string;
  dateDebutProduction?: string;
  investissementDA?: string;
  investissementUSD?: string;
  capaciteInstallee?: string;
  commentaires?: string;
}

const defaultForm: CahierDesCharges = {
  id: 0,
  id_demande: 0,
  num_cdc: '',
  dateExercice: '',
  fuseau: '',
  typeCoordonnees: '',
  natureJuridique: '',
  vocationTerrain: '',
  nomGerant: '',
  personneChargeTrxx: '',
  qualification: '',
  reservesGeologiques: null,
  reservesExploitables: null,
  volumeExtraction: '',
  dureeExploitation: '',
  methodeExploitation: '',
  dureeTravaux: '',
  dateDebutTravaux: '',
  dateDebutProduction: '',
  investissementDA: '',
  investissementUSD: '',
  capaciteInstallee: '',
  commentaires: '',
};

export default function CahierChargesDemande() {
  const [formData, setFormData] = useState(defaultForm);
  const [isEditing, setIsEditing] = useState(false);
  const searchParams = useSearchParams();
  const idProc = searchParams?.get('id');
  const [demandeId, setDemandeId] = useState<number | null>(null);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchDemandeFromProc = async (id_proc: string) => {
      try {
        const res = await fetch(`${apiURL}/api/procedures/${id_proc}/demande`);
        const demande = await res.json();
        setDemandeId(demande.id_demande);
      } catch (err) {
        console.error('Erreur récupération demande:', err);
      }
    };

    if (idProc) fetchDemandeFromProc(idProc);
  }, [idProc]);

  useEffect(() => {
    const fetchCahier = async () => {
      try {
        const res = await fetch(`${apiURL}/api/demande/cahier/${demandeId}`);
        if (!res.ok) return;
        const cahier = await res.json();

        const formatDate = (iso: string | null | undefined) =>
          iso ? new Date(iso).toISOString().split('T')[0] : '';

        setFormData({
          ...cahier,
          dateDebutTravaux: formatDate(cahier.dateDebutTravaux),
          dateDebutProduction: formatDate(cahier.dateDebutProduction),
          dateExercice: cahier.dateExercice
            ? new Date(cahier.dateExercice).getFullYear().toString()
            : '',
          reservesGeologiques: cahier.reservesGeologiques ?? null,
          reservesExploitables: cahier.reservesExploitables ?? null,
        });

        setIsEditing(true);
      } catch (err) {
        console.error('Erreur fetch:', err);
      }
    };
    if (demandeId) fetchCahier();
  }, [demandeId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'reservesGeologiques' || name === 'reservesExploitables') {
      const floatValue = value === '' ? null : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: floatValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(`${apiURL}/api/demande/cahier/${demandeId}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          num_cdc: formData.dateExercice || formData.num_cdc.substring(0, 4),
        }),
      });
      if (!res.ok) throw new Error('Erreur sauvegarde');
      const updated = await res.json();
      setFormData(updated);
      setIsEditing(true);
      alert('Enregistré avec succés');
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur sauvegarde');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${apiURL}/api/demande/cahier/${demandeId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur suppression');
      setFormData(defaultForm);
      setIsEditing(false);
      alert('Supprimé avec succés');
    } catch (err) {
      console.error(err);
      alert('Erreur suppression');
    }
  };



const generatePDF = (formData: CahierDesCharges) => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Set margins and initial position
  const margin = 20;
  let yPosition = margin;
  
  // Add logo or header (if you have one)
  // doc.addImage(logo, 'PNG', margin, yPosition, 40, 20);
  yPosition += 25;
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 128, 185); // Nice blue color
  doc.text('CAHIER DES CHARGES', margin, yPosition);
  yPosition += 15;
  
  // Document number and date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`N°: ${formData.num_cdc || 'Non spécifié'}`, margin, yPosition);
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 150, yPosition);
  yPosition += 15;
  
  // Add a separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, 190, yPosition);
  yPosition += 15;
  
  // Section 1: Informations Générales
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 73, 94);
  doc.text('1. INFORMATIONS GéNéRALES', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  // Create a table for general information
  const generalInfo = [
    ['Année d\'exercice', formData.dateExercice || 'Non spécifié'],
    ['Fuseau', formData.fuseau || 'Non spécifié'],
    ['Type de coordonnées', formData.typeCoordonnees || 'Non spécifié']
  ];
  
  generalInfo.forEach(([label, value]) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 60, yPosition);
    yPosition += 7;
  });
  
  yPosition += 10;
  
  // Section 2: Terrain
  if (yPosition > 240) {
    doc.addPage();
    yPosition = margin;
  }
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 73, 94);
  doc.text('2. TERRAIN', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const terrainInfo = [
    ['Nature juridique', formData.natureJuridique || 'Non spécifié'],
    ['Vocation du terrain', formData.vocationTerrain || 'Non spécifié'],
    ['Nom du gérant', formData.nomGerant || 'Non spécifié'],
    ['Personne en charge des travaux', formData.personneChargeTrxx || 'Non spécifié'],
    ['Qualification', formData.qualification || 'Non spécifié']
  ];
  
  terrainInfo.forEach(([label, value]) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    
    // Handle long text by splitting into multiple lines
    const splitText = doc.splitTextToSize(value, 120);
    doc.text(splitText, margin + 60, yPosition);
    yPosition += (splitText.length * 7);
  });
  
  yPosition += 10;
  
  // Section 3: Réserves
  if (yPosition > 240) {
    doc.addPage();
    yPosition = margin;
  }
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 73, 94);
  doc.text('3. RéSERVES', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  
  const reservesInfo = [
    ['Réserves géologiques (tonnes)', formData.reservesGeologiques ? formData.reservesGeologiques.toLocaleString('fr-FR') : 'Non spécifié'],
    ['Réserves exploitables (tonnes)', formData.reservesExploitables ? formData.reservesExploitables.toLocaleString('fr-FR') : 'Non spécifié']
  ];
  
  reservesInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 70, yPosition);
    yPosition += 7;
  });
  
  yPosition += 10;
  
  // Section 4: Exploitation
  if (yPosition > 240) {
    doc.addPage();
    yPosition = margin;
  }
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 73, 94);
  doc.text('4. EXPLOITATION', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  
  const exploitationInfo = [
    ['Volume d\'extraction (tonnes/an)', formData.volumeExtraction || 'Non spécifié'],
    ['Durée d\'exploitation', formData.dureeExploitation || 'Non spécifié'],
    ['Méthode d\'exploitation', formData.methodeExploitation || 'Non spécifié'],
    ['Durée des travaux', formData.dureeTravaux || 'Non spécifié'],
    ['Date de début des travaux', formData.dateDebutTravaux || 'Non spécifié'],
    ['Date de début de production', formData.dateDebutProduction || 'Non spécifié']
  ];
  
  exploitationInfo.forEach(([label, value]) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    
    const splitText = doc.splitTextToSize(value, 120);
    doc.text(splitText, margin + 70, yPosition);
    yPosition += (splitText.length * 7);
  });
  
  yPosition += 10;
  
  // Section 5: Investissements
  if (yPosition > 240) {
    doc.addPage();
    yPosition = margin;
  }
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 73, 94);
  doc.text('5. INVESTISSEMENTS', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  
  const investmentInfo = [
    ['Investissement (DA)', formData.investissementDA ? `${parseFloat(formData.investissementDA).toLocaleString('fr-FR')} DA` : 'Non spécifié'],
    ['Investissement (USD)', formData.investissementUSD ? `$${parseFloat(formData.investissementUSD).toLocaleString('fr-FR')}` : 'Non spécifié'],
    ['Capacité installée (tonnes/jour)', formData.capaciteInstallee || 'Non spécifié']
  ];
  
  investmentInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 60, yPosition);
    yPosition += 7;
  });
  
  yPosition += 10;
  
  // Section 6: Commentaires
  if (yPosition > 240) {
    doc.addPage();
    yPosition = margin;
  }
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 73, 94);
  doc.text('6. COMMENTAIRES', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  if (formData.commentaires) {
    const comments = doc.splitTextToSize(formData.commentaires, 170);
    doc.text(comments, margin, yPosition);
    yPosition += (comments.length * 7);
  } else {
    doc.text('Aucun commentaire', margin, yPosition);
    yPosition += 7;
  }
  
  yPosition += 15;
  
  // Footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} sur ${pageCount}`, 105, 285, { align: 'center' });
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 190, 285, { align: 'right' });
  }
  
  // Save the PDF
  doc.save(`Cahier-des-Charges-${formData.num_cdc || new Date().getTime()}.pdf`);
};
const handleGeneratePDF = () => {
  generatePDF(formData);
};

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.formTitle}>Cahier des Charges</h1>
          <p className={styles.formSubtitle}>Renseignez toutes les informations nécessaires</p>
        </div>
        <div className={styles.controls}>
          <button className={styles.pdfButton} onClick={handleGeneratePDF}>
            <svg className={styles.pdfIcon} viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            Exporter PDF
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Informations Générales</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Numéro CDC</label>
                <input 
                  type="text" 
                  name="num_cdc" 
                  value={formData.num_cdc} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Année d'exercice</label>
                <input 
                  type="number" 
                  name="dateExercice" 
                  value={formData.dateExercice} 
                  onChange={handleInputChange} 
                  min="1900" 
                  max="2100" 
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Fuseau</label>
                <input 
                  type="text" 
                  name="fuseau" 
                  value={formData.fuseau} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Type coordonnées</label>
                <input 
                  type="text" 
                  name="typeCoordonnees" 
                  value={formData.typeCoordonnees} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Terrain</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Nature juridique</label>
                <input 
                  type="text" 
                  name="natureJuridique" 
                  value={formData.natureJuridique} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Vocation terrain</label>
                <input 
                  type="text" 
                  name="vocationTerrain" 
                  value={formData.vocationTerrain} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Nom Gérant</label>
                <input 
                  type="text" 
                  name="nomGerant" 
                  value={formData.nomGerant} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Personne en charge des travaux</label>
                <input 
                  type="text" 
                  name="personneChargeTrxx" 
                  value={formData.personneChargeTrxx} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Qualification</label>
                <input 
                  type="text" 
                  name="qualification" 
                  value={formData.qualification} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Réserves</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Réserves Géologiques</label>
                <input 
                  type="number" 
                  name="reservesGeologiques" 
                  value={formData.reservesGeologiques ?? ''} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Réserves Exploitables</label>
                <input 
                  type="number" 
                  name="reservesExploitables" 
                  value={formData.reservesExploitables ?? ''} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Exploitation</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Volume Extraction</label>
                <input 
                  type="number" 
                  name="volumeExtraction" 
                  value={formData.volumeExtraction} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Durée Exploitation</label>
                <input 
                  type="text" 
                  name="dureeExploitation" 
                  value={formData.dureeExploitation} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Méthode Exploitation</label>
                <input 
                  type="text" 
                  name="methodeExploitation" 
                  value={formData.methodeExploitation} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Durée Travaux</label>
                <input 
                  type="text" 
                  name="dureeTravaux" 
                  value={formData.dureeTravaux} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Date Début Travaux</label>
                <input 
                  type="date" 
                  name="dateDebutTravaux" 
                  value={formData.dateDebutTravaux} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Date Début Production</label>
                <input 
                  type="date" 
                  name="dateDebutProduction" 
                  value={formData.dateDebutProduction} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Investissements</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Investissement DA</label>
                <input 
                  type="number" 
                  name="investissementDA" 
                  value={formData.investissementDA} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Investissement USD</label>
                <input 
                  type="number" 
                  name="investissementUSD" 
                  value={formData.investissementUSD} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Capacité Installée</label>
                <input 
                  type="number" 
                  name="capaciteInstallee" 
                  value={formData.capaciteInstallee} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Commentaires</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroupFull}>
                <label>Commentaires</label>
                <textarea 
                  name="commentaires" 
                  value={formData.commentaires} 
                  onChange={handleInputChange} 
                  rows={4} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          {isEditing && (
            <button 
              type="button" 
              onClick={handleDelete}
              className={styles.deleteButton}
            >
              <svg className={styles.deleteIcon} viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              Supprimer
            </button>
          )}
          <button type="submit" className={styles.submitButton}>
            {isEditing ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}