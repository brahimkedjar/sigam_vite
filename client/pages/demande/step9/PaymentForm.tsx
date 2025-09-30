// components/payments/PaymentForm.tsx

import { ChangeEvent, FormEvent, useState } from 'react';
import styles from '@/pages/DEA/Payments.module.css';
interface PaymentFormData {
  amount: string;
  paymentDate: string;
  paymentMethod: string;
  receiptNumber: string;
  proofFile: File | null;
}

interface PaymentFormProps {
  obligation: {
    id: number;
    typePaiement: {
      libelle: string;
    };
  };
  onSubmit: (paymentData: {
    amount: number;
    currency: string;
    paymentDate: string;
    paymentMethod: string;
    receiptNumber: string;
    proofUrl: string;
  }) => Promise<void>;
}

const PaymentForm = ({ obligation, onSubmit }: PaymentFormProps) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: '',
    paymentDate: '',
    paymentMethod: 'Virement',
    receiptNumber: '',
    proofFile: null,
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, proofFile: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      
      // In a real app, you would upload the file to a storage service first
      // and get back a URL to store in the database
      const proofUrl = '/uploads/' + formData.proofFile?.name;
      
      await onSubmit({
        amount: parseFloat(formData.amount),
        currency: 'DZD',
        paymentDate: formData.paymentDate,
        paymentMethod: formData.paymentMethod,
        receiptNumber: formData.receiptNumber,
        proofUrl,
      });
      
      // Reset form
      setFormData({
        amount: '',
        paymentDate: '',
        paymentMethod: 'Virement',
        receiptNumber: '',
        proofFile: null,
      });
    } catch (error) {
      console.error('Error submitting payment:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.paymentFormContainer}>
      <h3 className={styles.formTitle}>Saisie des preuves de paiement</h3>
      <p className={styles.formInstructions}>
        Pour chaque frais, saisissez les informations de paiement reçues du demandeur et uploadez les justificatifs officiels. 
        Vérifiez la conformité avant validation.
      </p>
      
      <form onSubmit={handleSubmit} className={styles.paymentForm}>
        <div className={styles.formGroup}>
          <label htmlFor="amount">Montant payé (DZD) *</label>
          <input
  type="number"
  id="amount"
  name="amount"
  value={formData.amount}
  onChange={handleChange}
  required
  min="0"
  step="0.000001"   
  placeholder="Montant exact du reçu"
/>

        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="paymentDate">Date de paiement *</label>
          <input
            type="date"
            id="paymentDate"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="paymentMethod">Mode de paiement *</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="Virement">Virement</option>
            <option value="Chèque">Chèque</option>
            <option value="Espèces">Espèces</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="receiptNumber">Référence du reçu *</label>
          <input
            type="text"
            id="receiptNumber"
            name="receiptNumber"
            value={formData.receiptNumber}
            onChange={handleChange}
            required
            placeholder="ex: TRX/1452/ANAM"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="proofFile">Uploadez le reçu officiel *</label>
          <div className={styles.fileUpload}>
            <input
              type="file"
              id="proofFile"
              name="proofFile"
              onChange={handleFileChange}
              required
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <span className={styles.fileInfo}>
              {formData.proofFile ? formData.proofFile.name : 'Aucun fichier sélectionné'}
            </span>
          </div>
          <p className={styles.fileHint}>PDF, JPG, PNG (max 5MB) - Reçu signé et tamponné par la recette des impôts</p>
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={uploading}
        >
          {uploading ? 'Enregistrement...' : 'Valider le paiement'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;