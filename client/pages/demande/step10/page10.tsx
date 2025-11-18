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
  const doc = new jsPDF();

  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - margin * 2;
  const bottomMargin = 20;
  const lineHeight = 6;
  const labelWidth = 65;
  const valueWidth = usableWidth - labelWidth - 5;

  let y = margin;

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      y = margin;
    }
  };

  const drawSectionTitle = (title: string) => {
    ensureSpace(12);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 73, 94);
    doc.text(title, margin, y);
    y += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
  };

  const drawRows = (rows: [string, string][]) => {
    rows.forEach(([label, rawValue]) => {
      const value = rawValue ?? '';
      const labelLines = doc.splitTextToSize(label, labelWidth);
      const valueLines = doc.splitTextToSize(value, valueWidth);
      const rowHeight =
        Math.max(labelLines.length, valueLines.length) * lineHeight;

      ensureSpace(rowHeight);

      doc.setFont('helvetica', 'bold');
      labelLines.forEach((line: string | string[], index: number) => {
        doc.text(line, margin, y + index * lineHeight);
      });
      doc.setFont('helvetica', 'normal');
      valueLines.forEach((line: string | string[], index: number) => {
        doc.text(line, margin + labelWidth + 5, y + index * lineHeight);
      });

      y += rowHeight + 2;
    });
  };

  // ----- Header -----
  y += 25;
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 128, 185);
  doc.text('CAHIER DES CHARGES', margin, y);
  y += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`N°: ${formData.num_cdc || 'Non spécifié'}`, margin, y);
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, margin + 130, y);
  y += 10;

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // ----- Section 1: Informations générales -----
  drawSectionTitle('1. INFORMATIONS GÉNÉRALES');
  drawRows([
    ["Année d'exercice", formData.dateExercice || 'Non spécifié'],
    ['Fuseau', formData.fuseau || 'Non spécifié'],
    ['Type de coordonnées', formData.typeCoordonnees || 'Non spécifié'],
  ]);

  // ----- Section 2: Terrain -----
  drawSectionTitle('2. TERRAIN');
  drawRows([
    ['Nature juridique', formData.natureJuridique || 'Non spécifié'],
    ['Vocation du terrain', formData.vocationTerrain || 'Non spécifié'],
    ['Nom du gérant', formData.nomGerant || 'Non spécifié'],
    [
      'Personne en charge des travaux',
      formData.personneChargeTrxx || 'Non spécifié',
    ],
    ['Qualification', formData.qualification || 'Non spécifié'],
  ]);

  // ----- Section 3: Réserves -----
  drawSectionTitle('3. RÉSERVES');
  drawRows([
    [
      'Réserves géologiques (tonnes)',
      formData.reservesGeologiques != null
        ? formData.reservesGeologiques.toLocaleString('fr-FR')
        : 'Non spécifié',
    ],
    [
      'Réserves exploitables (tonnes)',
      formData.reservesExploitables != null
        ? formData.reservesExploitables.toLocaleString('fr-FR')
        : 'Non spécifié',
    ],
  ]);

  // ----- Section 4: Exploitation -----
  drawSectionTitle('4. EXPLOITATION');
  drawRows([
    [
      "Volume d'extraction (tonnes/an)",
      formData.volumeExtraction && formData.volumeExtraction !== ''
        ? String(formData.volumeExtraction)
        : 'Non spécifié',
    ],
    [
      "Durée d'exploitation",
      formData.dureeExploitation && formData.dureeExploitation !== ''
        ? String(formData.dureeExploitation)
        : 'Non spécifié',
    ],
    [
      "Méthode d'exploitation",
      formData.methodeExploitation && formData.methodeExploitation !== ''
        ? String(formData.methodeExploitation)
        : 'Non spécifié',
    ],
    [
      'Durée des travaux',
      formData.dureeTravaux && formData.dureeTravaux !== ''
        ? String(formData.dureeTravaux)
        : 'Non spécifié',
    ],
    [
      'Date de début des travaux',
      formData.dateDebutTravaux && formData.dateDebutTravaux !== ''
        ? String(formData.dateDebutTravaux)
        : 'Non spécifié',
    ],
    [
      'Date de début de production',
      formData.dateDebutProduction && formData.dateDebutProduction !== ''
        ? String(formData.dateDebutProduction)
        : 'Non spécifié',
    ],
  ]);

  // ----- Section 5: Investissements -----
  drawSectionTitle('5. INVESTISSEMENTS');

  const investissementDA =
    formData.investissementDA && formData.investissementDA !== ''
      ? `${Number(formData.investissementDA).toLocaleString('fr-FR')} DA`
      : 'Non spécifié';

  const investissementUSD =
    formData.investissementUSD && formData.investissementUSD !== ''
      ? `$${Number(formData.investissementUSD).toLocaleString('fr-FR')}`
      : 'Non spécifié';

  const capaciteInstallee =
    formData.capaciteInstallee && formData.capaciteInstallee !== ''
      ? String(formData.capaciteInstallee)
      : 'Non spécifié';

  drawRows([
    ['Investissement (DA)', investissementDA],
    ['Investissement (USD)', investissementUSD],
    ['Capacité installée (tonnes/jour)', capaciteInstallee],
  ]);

  // ----- Section 6: Commentaires -----
  drawSectionTitle('6. COMMENTAIRES');
  const commentsText =
    formData.commentaires && formData.commentaires.trim().length > 0
      ? formData.commentaires
      : 'Aucun commentaire';

  const commentsLines = doc.splitTextToSize(commentsText, usableWidth);
  ensureSpace(commentsLines.length * lineHeight);
  commentsLines.forEach((line: string | string[], index: number) => {
    doc.text(line, margin, y + index * lineHeight);
  });
  y += commentsLines.length * lineHeight + 4;

  // Footer (pages)
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} sur ${pageCount}`, pageWidth / 2, pageHeight - 10, {
      align: 'center',
    });
    doc.text(
      `Généré le ${new Date().toLocaleDateString('fr-FR')}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' },
    );
  }

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
