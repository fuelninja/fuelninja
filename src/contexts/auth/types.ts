
export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
}
