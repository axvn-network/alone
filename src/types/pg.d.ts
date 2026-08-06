declare module "pg" {
  export class Pool {
    constructor(config?: {
      connectionString?: string;
      ssl?: boolean | { rejectUnauthorized?: boolean };
      max?: number;
      idleTimeoutMillis?: number;
      connectionTimeoutMillis?: number;
    });
    query(text: string, params?: any[]): Promise<{ rows: any[]; rowCount: number }>;
    end(): Promise<void>;
  }
}
