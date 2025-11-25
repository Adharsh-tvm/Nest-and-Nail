// application/validators/AuthValidator.ts
import { LoginUserDTO, UserRequestDTO } from "../dtos/UserDTO";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthValidator {
  static validateRegistration(data: UserRequestDTO): void {
    if (!data.user_name || data.user_name.trim().length < 2) {
      throw new ValidationError("Name must be at least 2 characters");
    }

    if (!this._isValidEmail(data.email_address)) {
      throw new ValidationError("Invalid email format");
    }

    if (!data.password || data.password.length < 8) {
      throw new ValidationError("Password must be at least 8 characters");
    }

    if (data.phone_number && !this._isValidPhone(data.phone_number)) {
      throw new ValidationError("Invalid phone number");
    }
  }

  static validateLogin(data: LoginUserDTO): void {
    if (!this._isValidEmail(data.email_address)) {
      throw new ValidationError("Invalid email format");
    }

    if (!data.password) {
      throw new ValidationError("Password is required");
    }
  }

  private static _isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static _isValidPhone(phone: number): boolean {
    const phoneStr = phone.toString();
    return phoneStr.length >= 10 && phoneStr.length <= 15;
  }
}