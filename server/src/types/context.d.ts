import { Request, Response } from "express";
import { User } from "./user"; // Ensure this path is correct

export interface GraphQLContext {
  req: Request & { session: { user?: User } };
  res: Response;
}

// Extend Express Session to include user
declare module "express-session" {
  interface Session {
    user?: { id: string; username: string };
  }
}
