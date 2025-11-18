import bcrypt from "bcryptjs";
import { IPasswordHasher } from "../../application/services/IPasswordHasher";

export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly _saltRounds = 10;

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this._saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
