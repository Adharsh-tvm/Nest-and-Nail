import { Role } from "../enums/authEnums";

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}