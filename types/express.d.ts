import type { Role } from "../generated/prisma/index.js";

declare global {
  namespace Express {
    interface User {
      id: string;
      role: Role;
      access: string[];
    }

    interface Request {
      user?: User;
    }
  }
}
