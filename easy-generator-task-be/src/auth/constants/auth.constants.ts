  export const COOKIE_NAMES = {
    AUTHENTICATION: 'Authentication',
    REFRESH_TOKEN: 'RefreshToken',
  } as const;

export const TOKEN_EXPIRATIONS = {
    ACCESS_TOKEN: 10,
    REFRESH_TOKEN: 50 ,
  } as const;