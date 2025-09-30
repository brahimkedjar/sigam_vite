// src/types/express.d.ts
// Replace with your actual payload structure
export interface UserFromJwt {
  id: number;
  email: string;
  role: string;
  permissions: string[];
}

declare global {
  namespace Express {
    interface Request {
      user: UserFromJwt; // customize this type
    }
  }
}

