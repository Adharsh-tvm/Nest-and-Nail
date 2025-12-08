import { Role } from "../../domain/enums/enums";

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}