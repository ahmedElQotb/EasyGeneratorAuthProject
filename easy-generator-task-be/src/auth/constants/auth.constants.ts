  export const COOKIE_NAMES = {
    AUTHENTICATION: 'Authentication',
    REFRESH_TOKEN: 'RefreshToken',
  } as const;

export const TOKEN_EXPIRATIONS = {
    ACCESS_TOKEN: 900,
    REFRESH_TOKEN: 172800 ,
  } as const;