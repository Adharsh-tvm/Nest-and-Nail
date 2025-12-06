import { Role } from "../../shared/enums/enums"; 

export interface JwtPayload {
  id: string;
  name:string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}