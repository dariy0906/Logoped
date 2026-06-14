import type { UserRole } from '.prisma/client/default.js';

export type RegisterDto = {
  username: string;
  email: string;
  password: string;
  role?: UserRole | null;
};
