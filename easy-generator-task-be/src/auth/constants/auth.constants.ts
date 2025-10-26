  export const COOKIE_NAMES = {
    AUTHENTICATION: 'Authentication',
    REFRESH_TOKEN: 'RefreshToken',
  } as const;

export const TOKEN_EXPIRATIONS = {
    ACCESS_TOKEN: 900, // 15 minutes
    REFRESH_TOKEN: 604800, // 7 days
  } as const;