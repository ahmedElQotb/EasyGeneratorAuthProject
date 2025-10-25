export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
      uri: process.env.MONGODB_URI,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      accessTokenExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
      refreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    },
  });