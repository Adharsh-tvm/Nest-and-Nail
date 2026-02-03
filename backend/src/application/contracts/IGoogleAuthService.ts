export interface IGoogleAuthService {
  getUserFromAccessToken(accessToken: string): Promise<{
    email: string;
    name: string;
    picture?: string;
  }>;
}
