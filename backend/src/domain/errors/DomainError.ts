export class DomainError extends Error {
    constructor (
        message: string,
        public readonly code: string
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class AuthenticationError extends DomainError {
  constructor(message = "Authentication failed") {
    super(message, "AUTH_ERROR");
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor() {
    super("Invalid email or password");
  }
}

export class UserBlockedError extends AuthenticationError {
  constructor() {
    super("Your account is blocked");
  }
}

export class UserNotFoundError extends DomainError {
  constructor() {
    super("User not found", "USER_NOT_FOUND");
  }
}

export class UserAlreadyExistsError extends DomainError {
  constructor() {
    super("User already exists", "USER_EXISTS");
  }
}