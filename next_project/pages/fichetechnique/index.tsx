'use client';

import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import styles from './FicheTechniqueForm.module.css';
import { useSearchParams } from '@/src/hooks/useSearchParams';

// ✅ Types
type Equipment = { type: string; capacite: string; montant: string };
type TaxStatus = 'A_payer' | 'Payé' | 'En_retard' | 'Annulé' | 'Partiellement_payé';

type TaxDetail = {
  montant: number;
  statut: TaxStatus;
};

type Tax = {
  annee: string;
  ts: TaxDetail;
  dea: TaxDetail;
  prdattr?: TaxDetail;
};

interface SubstanceItem {
  id: number;
  nomFR: string;
  nomAR: string;
  categorie: string;
  famille: string;
  priorite: 'principale' | 'secondaire';
}
interface FormData {
  designation: string;
  formeJuridique: string;
  pays: string;
  representant: string;
  qualite: string;
  adresse: string;
  telFax: string;
  rcNum: string;
  rcDate: string;
  expertDossier: string;

  lieuDit: string;
  commune: string;
  wilaya: string;
  superficie: string;
  investissementsPrevusExploration: string;
  investissementsRealisesExploration: string;
  substances: SubstanceItem[];
  destination: string;
  investissementsPrevusExploitation: string;

  equipementsExtraction: Equipment[];
  materielsRoulants: Equipment[];
  genieCivil: Equipment[];
  autresEquipements: Equipment[];

  effectifs: string;
  cadres: string;
  maitrises: string;
  executions: string;
  securites: string;
  joursOuvrables: string;
  postesParJour: string;
  prixRevientExtrait: string;
  prixRevientProduit: string;
  valeurMarcheProduit: string;

  reservesGeologiques: string;
  reservesExploitables: string;
  dureeExploitation: string;
  quantitesExtraire: string;
  modeExploitation: string;
  modeAbattage: string;
  productionAnnuelle: string;
  capaciteProductionAnnuelle: string;
  capaciteInstallee: string;
  quantiteExplosifs: string;

  taxes: Tax[];
  remarques: string;
}

// ✅ Initial state
const initialFormData: FormData = {
  designation: '',
  formeJuridique: '',
  pays: '',
  representant: '',
  qualite: '',
  adresse: '',
  telFax: '',
  rcNum: '',
  rcDate: '',
  expertDossier: '',

  lieuDit: '',
  commune: '',
  wilaya: '',
  superficie: '',
  investissementsPrevusExploration: '',
  investissementsRealisesExploration: '',
  substances: [],
  destination: '',
  investissementsPrevusExploitation: '',

  equipementsExtraction: [{ type: '', capacite: '', montant: '' }],
  materielsRoulants: [{ type: '', capacite: '', montant: '' }],
  genieCivil: [{ type: '', capacite: '', montant: '' }],
  autresEquipements: [{ type: '', capacite: '', montant: '' }],

  effectifs: '',
  cadres: '',
  maitrises: '',
  executions: '',
  securites: '',
  joursOuvrables: '',
  postesParJour: '',
  prixRevientExtrait: '',
  prixRevientProduit: '',
  valeurMarcheProduit: '',

  reservesGeologiques: '',
  reservesExploitables: '',
  dureeExploitation: '',
  quantitesExtraire: '',
  modeExploitation: 'Exploitation à ciel ouvert',
  modeAbattage: "Abattage à l'explosif, émottage mécanique",
  productionAnnuelle: '',
  capaciteProductionAnnuelle: '',
  capaciteInstallee: '',
  quantiteExplosifs: '',

  taxes: [
  
  ],

  remarques: ''
};

const FicheTechnique: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const id_proc = searchParams.get('id'); 
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  // ✅ Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      if (!id_proc) return;

      try {
        const res = await fetch(`${apiURL}/api/procedures/${id_proc}/fiche-technique`);
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        console.log('Fetched data:', data);
        // ðŸŸ¢ Map backend response to formData
        setFormData(prev => ({
          ...prev,
          designation: data.demande?.detenteur?.nom_societeFR || '',
          formeJuridique: data.demande?.detenteur?.statutJuridique?.statut_fr || '',
          pays: data.demande?.detenteur?.pays?.nom_pays || '',
          representant: data.demande?.detenteur?.fonctions?.[0]?.personne?.nomFR || '',
          qualite: data.demande?.detenteur?.fonctions?.[0]?.personne?.qualification || '',
          adresse: data.demande?.detenteur?.adresse_siege || '',
          telFax: data.demande?.detenteur?.telephone || '',
          rcNum: data.demande?.detenteur?.registreCommerce?.[0]?.numero_rc || '',
          rcDate: data.demande?.detenteur?.registreCommerce?.[0]?.date_enregistrement
          ? new Date(data.demande.detenteur.registreCommerce[0].date_enregistrement)
          .toISOString()
          .split('T')[0] // ✅ keep only yyyy-MM-dd
          : '',
          expertDossier: data.demande?.expertMinier?.nom_expert || '',
          
          lieuDit: data.demande?.lieu_ditFR || '',
          commune: data.demande?.commune?.nom_communeFR || '',
          wilaya: data.demande?.wilaya?.nom_wilayaFR || '',
          superficie: data.demande?.superficie?.toString() || '',
          destination: data.demande?.destination || '',
          remarques: data.demande?.remarques || '',
          // techno-economiques
          investissementsPrevusExploitation: data.demande?.budget_prevu?.toString() || '',
          // TODO: map equipements + taxes from backend if available
          equipementsExtraction: data.equipementsExtraction || [{ type: '', capacite: '', montant: '' }],
          materielsRoulants: data.materielsRoulants || [{ type: '', capacite: '', montant: '' }],
          genieCivil: data.genieCivil || [{ type: '', capacite: '', montant: '' }],
          autresEquipements: data.autresEquipements || [{ type: '', capacite: '', montant: '' }],
          taxes: data.taxes || prev.taxes,
          substances: data.substances || [],
        }));

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id_proc]);

  if (loading) return <p>Chargement des données...</p>;
  // ✅ Input Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (
    section: keyof Pick<FormData, 'equipementsExtraction' | 'materielsRoulants' | 'genieCivil' | 'autresEquipements'>,
    index: number,
    field: keyof Equipment,
    value: string
  ) => {
    setFormData(prev => {
      const newArray = [...prev[section]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  };

  const handleTaxInputChange = (index: number, field: keyof Tax, value: string) => {
    setFormData(prev => {
      const newTaxes = [...prev.taxes];
      newTaxes[index] = { ...newTaxes[index], [field]: value };
      return { ...prev, taxes: newTaxes };
    });
  };

  const addRow = (
    section: keyof Pick<FormData, 'equipementsExtraction' | 'materielsRoulants' | 'genieCivil' | 'autresEquipements'>
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], { type: '', capacite: '', montant: '' }]
    }));
  };

  const removeRow = (
    section: keyof Pick<FormData, 'equipementsExtraction' | 'materielsRoulants' | 'genieCivil' | 'autresEquipements'>,
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // ✅ PDF Generator with Totals
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20).setTextColor(40, 53, 80);
    doc.text('Fiche Technique - Permis Minier', 105, 15, { align: 'center' });

    let y = 25;

    // --- Company Identification ---
    doc.setFontSize(14).setTextColor(52, 73, 94).text('1 - Identification de la société', 14, y);
    y += 8;

    const companyData = [
      ['Désignation', formData.designation],
      ['Forme juridique', formData.formeJuridique],
      ['Pays', formData.pays],
      ['Représentant', formData.representant],
      ['Qualité', formData.qualite],
      ['Adresse', formData.adresse],
      ['Tel/Fax', formData.telFax],
      ['R.C n°', formData.rcNum],
      ['Date R.C', formData.rcDate],
      ['Expert dossier', formData.expertDossier]
    ];

    (doc as any).autoTable({
      startY: y,
      head: [['Champ', 'Valeur']],
      body: companyData,
      theme: 'grid',
      headStyles: { fillColor: [52, 152, 219] },
      margin: { left: 14, right: 14 }
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // --- Technico-Economiques ---
    doc.setFontSize(14).setTextColor(52, 73, 94).text('2 - Caractéristiques technico-économiques', 14, y);
    y += 8;

    const techEcoData = [
      ['Lieu dit', formData.lieuDit],
      ['Commune', formData.commune],
      ['Wilaya', formData.wilaya],
      ['Superficie (ha)', formData.superficie],
      ["Inv. prévus exploration (DA)", formData.investissementsPrevusExploration],
      ["Inv. réalisés exploration (DA)", formData.investissementsRealisesExploration],
      ['Substances',formData.substances.map(s => `${s.nomFR} (${s.priorite})`).join(', ')],
      ['Destination', formData.destination],
      ["Inv. prévus exploitation (DA)", formData.investissementsPrevusExploitation]
    ];

    (doc as any).autoTable({
      startY: y,
      head: [['Champ', 'Valeur']],
      body: techEcoData,
      theme: 'grid',
      headStyles: { fillColor: [52, 152, 219] },
      margin: { left: 14, right: 14 }
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // --- Equipments with totals ---
    const renderEquipmentTable = (title: string, data: Equipment[]) => {
      if (data.some(d => d.type || d.capacite || d.montant)) {
        doc.setFontSize(13).setTextColor(52, 73, 94).text(title, 14, y);
        y += 6;
        const rows = data.map(d => [d.type, d.capacite, d.montant]);
        const total = data.reduce((acc, d) => acc + (parseFloat(d.montant) || 0), 0);

        (doc as any).autoTable({
          startY: y,
          head: [["Type", "Capacité", "Montant (DA)"]],
          body: [...rows, ["", "Total", total.toLocaleString()]],
          theme: "grid",
          headStyles: { fillColor: [52, 152, 219] },
          margin: { left: 14, right: 14 }
        });

        y = (doc as any).lastAutoTable.finalY + 10;
      }
    };

    renderEquipmentTable("équipements d'extraction", formData.equipementsExtraction);
    renderEquipmentTable("Matériels roulants", formData.materielsRoulants);
    renderEquipmentTable("Génie civil", formData.genieCivil);
    renderEquipmentTable("Autres équipements", formData.autresEquipements);

    // --- Taxes ---
    doc.setFontSize(14).setTextColor(52, 73, 94).text('4 - Acquittement des Droits et Taxes', 14, y);
    y += 8;

    const taxRows = formData.taxes.map(t => [t.annee, t.ts, t.dea]);
    (doc as any).autoTable({
      startY: y,
      head: [["Année", "TS", "DEA"]],
      body: taxRows,
      theme: "grid",
      headStyles: { fillColor: [52, 152, 219] },
      margin: { left: 14, right: 14 }
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // --- Remarks ---
    if (formData.remarques) {
      doc.setFontSize(14).setTextColor(52, 73, 94).text('5 - Remarques', 14, y);
      y += 6;
      const split = doc.splitTextToSize(formData.remarques, 180);
      doc.setFontSize(11).setTextColor(0, 0, 0).text(split, 14, y);
    }

    doc.save('fiche-technique.pdf');
  };

  // ✅ Renderer for equipment section
 // ✅ Restrict section to only Equipment[] keys
const renderEquipmentSection = (
  title: string,
  section: keyof Pick<FormData, 'equipementsExtraction' | 'materielsRoulants' | 'genieCivil' | 'autresEquipements'>
) => {
  const data = formData[section] as Equipment[];

  return (
    <div className={styles.equipmentSection}>
      <h3>{title}</h3>
      {data.map((item: Equipment, index: number) => (
        <div key={index} className={styles.equipmentRow}>
          <input
            type="text"
            placeholder="Type"
            value={item.type}
            onChange={e => handleArrayInputChange(section, index, 'type', e.target.value)}
          />
          <input
            type="text"
            placeholder="Capacité"
            value={item.capacite}
            onChange={e => handleArrayInputChange(section, index, 'capacite', e.target.value)}
          />
          <input
            type="number"
            placeholder="Montant"
            value={item.montant}
            onChange={e => handleArrayInputChange(section, index, 'montant', e.target.value)}
          />
          <button type="button" onClick={() => removeRow(section, index)}>×</button>
        </div>
      ))}
      <button type="button" onClick={() => addRow(section)}>+ Ajouter</button>
    </div>
  );
};

  // ✅ JSX
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Fiche Technique - Permis Minier</h1>
      <form className={styles.form}>
        {/* Section 1: Company Identification */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1 - Identification de la société</h2>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label>Désignation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Forme juridique</label>
              <input
                type="text"
                name="formeJuridique"
                value={formData.formeJuridique}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Pays</label>
              <input
                type="text"
                name="pays"
                value={formData.pays}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Représentant</label>
              <input
                type="text"
                name="representant"
                value={formData.representant}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Qualité</label>
              <input
                type="text"
                name="qualite"
                value={formData.qualite}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Adresse</label>
              <textarea
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Tel/Fax</label>
              <input
                type="text"
                name="telFax"
                value={formData.telFax}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>R.C n°</label>
              <input
                type="text"
                name="rcNum"
                value={formData.rcNum}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Date R.C</label>
              <input
                type="date"
                name="rcDate"
                value={formData.rcDate}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Expert en charge du dossier</label>
              <input
                type="text"
                name="expertDossier"
                value={formData.expertDossier}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        {/* Section 2: Technical-Economic Characteristics */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2 - Caractéristiques technico-économiques</h2>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label>Lieu dit</label>
              <input
                type="text"
                name="lieuDit"
                value={formData.lieuDit}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Commune</label>
              <input
                type="text"
                name="commune"
                value={formData.commune}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Wilaya</label>
              <input
                type="text"
                name="wilaya"
                value={formData.wilaya}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Superficie (ha)</label>
              <input
                type="number"
                name="superficie"
                value={formData.superficie}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Investissements prévus pour l'exploration (DA)</label>
              <input
                type="number"
                name="investissementsPrevusExploration"
                value={formData.investissementsPrevusExploration}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Investissements réalisés pour l'exploration (DA)</label>
              <input
                type="number"
                name="investissementsRealisesExploration"
                value={formData.investissementsRealisesExploration}
                onChange={handleInputChange}
              />
            </div>
            <section className={styles.section}>
  <h2 className={styles.sectionTitle}>Substances</h2>
  <div className={styles.substanceTable}>
    <div className={styles.substanceHeader}>
      <div>Nom (FR)</div>
      <div>Nom (AR)</div>
      <div>Catégorie</div>
      <div>Famille</div>
      <div>Priorité</div>
    </div>
    {formData.substances.map((sub, index) => (
      <div key={sub.id || index} className={styles.substanceRow}>
        <input
          type="text"
          value={sub.nomFR}
          onChange={e => {
            const updated = [...formData.substances];
            updated[index].nomFR = e.target.value;
            setFormData({ ...formData, substances: updated });
          }}
        />
        <input
          type="text"
          value={sub.nomAR}
          onChange={e => {
            const updated = [...formData.substances];
            updated[index].nomAR = e.target.value;
            setFormData({ ...formData, substances: updated });
          }}
        />
        <select
          value={sub.priorite}
          onChange={e => {
            const updated = [...formData.substances];
            updated[index].priorite = e.target.value as 'principale' | 'secondaire';
            setFormData({ ...formData, substances: updated });
          }}
        >
          <option value="principale">Principale</option>
          <option value="secondaire">Secondaire</option>
        </select>
      </div>
    ))}
  </div>
</section>

            <div className={styles.inputGroup}>
              <label>Destination</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Investissements prévus pour exploitation (DA)</label>
              <input
                type="number"
                name="investissementsPrevusExploitation"
                value={formData.investissementsPrevusExploitation}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Equipment Tables */}
          {renderEquipmentSection("équipements d'extraction", 'equipementsExtraction')}
          {renderEquipmentSection('Matériels roulants', 'materielsRoulants')}
          {renderEquipmentSection('Génie Civil', 'genieCivil')}
          {renderEquipmentSection('Autres équipements', 'autresEquipements')}

          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label>Effectifs totaux</label>
              <input
                type="number"
                name="effectifs"
                value={formData.effectifs}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Cadres</label>
              <input
                type="number"
                name="cadres"
                value={formData.cadres}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Maitrises</label>
              <input
                type="number"
                name="maitrises"
                value={formData.maitrises}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Exécutions</label>
              <input
                type="number"
                name="executions"
                value={formData.executions}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Sécurités</label>
              <input
                type="number"
                name="securites"
                value={formData.securites}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Nombre de jours ouvrables</label>
              <input
                type="number"
                name="joursOuvrables"
                value={formData.joursOuvrables}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Nombre de poste par jour</label>
              <input
                type="number"
                name="postesParJour"
                value={formData.postesParJour}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Prix de revient par tonne extraite (DA/Tonne)</label>
              <input
                type="number"
                name="prixRevientExtrait"
                value={formData.prixRevientExtrait}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Prix de revient par tonne produite (DA/Tonne)</label>
              <input
                type="number"
                name="prixRevientProduit"
                value={formData.prixRevientProduit}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Valeur marchande du produit (DA)</label>
              <input
                type="number"
                name="valeurMarcheProduit"
                value={formData.valeurMarcheProduit}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        {/* Section 3: Technical Characteristics */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3 - Caractéristiques techniques</h2>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label>Réserves géologiques (Tonnes)</label>
              <input
                type="number"
                name="reservesGeologiques"
                value={formData.reservesGeologiques}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Réserves exploitables (Tonnes)</label>
              <input
                type="number"
                name="reservesExploitables"
                value={formData.reservesExploitables}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Durée de l'exploitation (Années)</label>
              <input
                type="number"
                name="dureeExploitation"
                value={formData.dureeExploitation}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Quantités à extraire (Tonnes)</label>
              <input
                type="number"
                name="quantitesExtraire"
                value={formData.quantitesExtraire}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Mode d'exploitation</label>
              <select
                name="modeExploitation"
                value={formData.modeExploitation}
                onChange={handleInputChange}
              >
                <option>Exploitation à ciel ouvert</option>
                <option>Exploitation souterraine</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Mode d'abattage</label>
              <select
                name="modeAbattage"
                value={formData.modeAbattage}
                onChange={handleInputChange}
              >
                <option>Abattage à l'explosif, émottage mécanique</option>
                <option>Abattage mécanique</option>
                <option>Abattage hydraulique</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Production annuelle (Tonnes)</label>
              <input
                type="number"
                name="productionAnnuelle"
                value={formData.productionAnnuelle}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Capacité de production annuelle (Tonnes/an)</label>
              <input
                type="number"
                name="capaciteProductionAnnuelle"
                value={formData.capaciteProductionAnnuelle}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Capacité installée (T/H)</label>
              <input
                type="number"
                name="capaciteInstallee"
                value={formData.capaciteInstallee}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Quantité d'explosifs (Kg/an)</label>
              <input
                type="number"
                name="quantiteExplosifs"
                value={formData.quantiteExplosifs}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        {/* Section 4: Taxes and Duties */}
<section className={styles.section}>
  <h2 className={styles.sectionTitle}>4 - Acquittement des Droits et Taxes</h2>
  <div className={styles.taxTable}>
    <div className={styles.taxHeader}>
      <div>Année</div>
      <div>TS</div>
      <div>DEA</div>
      <div>PRDATTR</div>
    </div>

    {formData.taxes.map((tax, index) => (
      <div key={index} className={styles.taxRow}>
        <div>{tax.annee}</div>

        {/* TS */}
        <div className={styles.taxCell}>
          <input
            type="text"
            value={tax.ts.montant}
            onChange={(e) => handleTaxInputChange(index, 'ts', e.target.value)}
          />
          <span
            className={`${styles.statusBadge} ${
              tax.ts.statut === 'A_payer'
                ? styles.statusApayer
                : tax.ts.statut === 'Payé'
                ? styles.statusPaye
                : tax.ts.statut === 'En_retard'
                ? styles.statusEnretard
                : tax.ts.statut === 'Annulé'
                ? styles.statusAnnule
                : styles.statusPartiel
            }`}
          >
            {tax.ts.statut.replace('_', ' ')}
          </span>
        </div>

        {/* DEA */}
        <div className={styles.taxCell}>
          <input
            type="text"
            value={tax.dea.montant}
            onChange={(e) => handleTaxInputChange(index, 'dea', e.target.value)}
          />
          <span
            className={`${styles.statusBadge} ${
              tax.dea.statut === 'A_payer'
                ? styles.statusApayer
                : tax.dea.statut === 'Payé'
                ? styles.statusPaye
                : tax.dea.statut === 'En_retard'
                ? styles.statusEnretard
                : tax.dea.statut === 'Annulé'
                ? styles.statusAnnule
                : styles.statusPartiel
            }`}
          >
            {tax.dea.statut.replace('_', ' ')}
          </span>
        </div>

        {/* PRDATTR */}
        <div className={styles.taxCell}>
          <input
            type="text"
            value={tax.prdattr!.montant}
            onChange={(e) => handleTaxInputChange(index, 'prdattr', e.target.value)}
          />
          <span
            className={`${styles.statusBadge} ${
              tax.prdattr!.statut === 'A_payer'
                ? styles.statusApayer
                : tax.prdattr!.statut === 'Payé'
                ? styles.statusPaye
                : tax.prdattr!.statut === 'En_retard'
                ? styles.statusEnretard
                : tax.prdattr!.statut === 'Annulé'
                ? styles.statusAnnule
                : styles.statusPartiel
            }`}
          >
            {tax.prdattr!.statut.replace('_', ' ')}
          </span>
        </div>
      </div>
    ))}
  </div>
</section>


        {/* Section 5: Remarks */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5 - Remarques</h2>
          <div className={styles.inputGroup}>
            <textarea
              name="remarques"
              value={formData.remarques}
              onChange={handleInputChange}
              rows={4}
              placeholder="Ajoutez vos remarques ici..."
            />
          </div>
        </section>

        <div className={styles.actions}>
          <button type="button" className={styles.saveBtn}>Enregistrer</button>
          <button type="button" className={styles.pdfBtn} onClick={generatePDF}>
            Télécharger PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default FicheTechnique;
