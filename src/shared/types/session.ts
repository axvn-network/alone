export interface SessionPayload {
  exp: number;
  permissions: string[];
  roles: string[];
  id: string;
  email: string;
}
