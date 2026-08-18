/**
 * src/modules/investor/types.ts
 */

export interface IInvestor {
  _id:       string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestorQuery {
  page?:  number;
  limit?: number;
}

export interface InvestorListResult {
  docs:  IInvestor[];
  total: number;
  page:  number;
  limit: number;
}
