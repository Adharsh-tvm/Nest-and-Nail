export type JwtPayload = {
  id: string;
  email: string;
  role: "client" | "worker" | "admin";
  name?: string;
};