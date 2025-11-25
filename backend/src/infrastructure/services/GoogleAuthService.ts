import { IGoogleAuthService } from "../../application/services/IGoogleAuthService";

export class GoogleAuthService implements IGoogleAuthService {

    async getUserFromAccessToken(accessToken: string): Promise<{ email: string; name: string; picture?: string; }> {
        const response = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Invalid Google access token");
        }

        const data = await response.json();

        return {
            email: data.email,
            name: data.name,
            picture: data.picture
        };
    }
}
