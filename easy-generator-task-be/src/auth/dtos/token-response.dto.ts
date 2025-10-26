export class TokenResponse {
    /** JWT access token for API authentication */
    accessToken: string;

    /** Refresh token for obtaining new access tokens */
    refreshToken: string;
  }