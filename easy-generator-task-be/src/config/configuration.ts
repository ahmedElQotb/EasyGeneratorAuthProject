import { CONFIG_KEYS } from './config-keys';

export default () => ({
    [CONFIG_KEYS.ENVIRONMENT]: process.env[CONFIG_KEYS.NODE_ENV] || 'development',
    [CONFIG_KEYS.PORT]: parseInt(process.env[CONFIG_KEYS.PORT] || '3000', 10),
    database: {
      uri: process.env[CONFIG_KEYS.MONGODB_URI],
    },
    jwt: {
      secret: process.env[CONFIG_KEYS.JWT_SECRET],
    },
    [CONFIG_KEYS.FRONTEND_LOCAL_URL]: process.env[CONFIG_KEYS.FRONTEND_LOCAL_URL] || 'http://localhost:5173',
  });