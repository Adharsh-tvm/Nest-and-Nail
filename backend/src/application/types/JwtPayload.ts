import { Role } from "../../shared/enums/enums"; 

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}