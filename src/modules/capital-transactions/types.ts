/**
 * src/modules/capital-transactions/types.ts
 *
 * TypeScript interfaces cho module giao dịch vốn.
 * Import từ đây thay vì định nghĩa lại ở nhiều nơi.
 */

export type CapTxType   = "capital_call" | "deposit" | "payment_confirm" | "adjustment";
export type CapTxStatus = "pending" | "confirmed" | "rejected" | "cancelled";

/** Shape trả về từ service (sau khi toSafe()) — dates là string ISO */
export interface CapitalTx {
  _id:              string;
  shareholderId:    string;
  shareholderName:  string;
  shareholderEmail: string;
  type:             CapTxType;
  status:           CapTxStatus;
  amount:           number;
  currency:         string;
  description:      string;
  referenceNo:      string;
  proofUrl:         string;
  adminNote:        string;
  processedBy:      string | null;
  processedAt:      string | null;
  createdAt:        string;
  updatedAt:        string;
}

export interface CapTxQuery {
  shareholderId?: string;
  type?:          CapTxType;
  status?:        CapTxStatus;
  page?:          number;
  limit?:         number;
}

export interface CreateCapTxDto {
  shareholderId: string;
  type:          CapTxType;
  amount:        number;
  description?:  string;
  referenceNo?:  string;
  adminNote?:    string;
  proofUrl?:     string;
}

export interface UpdateCapTxDto {
  id:          string;
  status:      "confirmed" | "rejected" | "cancelled";
  adminNote?:  string;
  processedBy: string;
}

export interface CapTxListResult {
  docs:  CapitalTx[];
  total: number;
  page:  number;
  limit: number;
}

export interface CapTxStats {
  totalPending:    number;
  totalConfirmed:  number;
  totalRejected:   number;
  pendingAmount:   number;
  confirmedAmount: number;
}
