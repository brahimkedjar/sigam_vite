export interface ObligationDto {
  id: number;
  typePaiement: {
    id: number;
    libelle: string;
  };
  amount: number;
  fiscalYear: number;
  dueDate: string;
  status: string;
  payments: Payment[]; // no change
  permis: {
    id: number;
    code_permis: string;
    detenteur?: {
      id?: number;
      nom_societeFR: string;
      registreCommerce?: {
        nif: string;
      };
    } | null;
  };
}

export interface PaymentDto {
  id: number;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentMethod: string;
  receiptNumber: string;
  status: string;
  proofUrl: string | null;
}

export interface DashboardStats {
  totalDue: number;
  totalPaid: number;
  overdueAmount: number;
  pendingCount: number;
  totalObligations: number;
  paidObligations: number;
  overdueObligations: number;
}

export type Payment = PaymentDto; // ✅ FIXED
