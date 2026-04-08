import { IRefreshTokenUseCase } from "../../interfaces/auth/IRefreshTokenUseCase";
import { ITokenService } from "../../contracts/ITokenService";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    private readonly _tokenService: ITokenService
  ) { }

  async execute(refreshToken: string) {
    // 1. Verify refresh token
    const payload = this._tokenService.verifyRefreshToken(refreshToken);

    // 2. Generate new tokens
    const newAccessToken = this._tokenService.generateAccessToken({
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role
    });

    const newRefreshToken = this._tokenService.generateRefreshToken({
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }
}