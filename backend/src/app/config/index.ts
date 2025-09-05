import { config } from 'dotenv';
import type { AppConfig } from '../interfaces/config';

config();

export const appConfig: AppConfig = {
    app: {
        port: Number(process.env.PORT),
    },
    db: {
        url: String(process.env.MONGODB_URL),
    },
    jwt: {
        publicSecretKey: String(process.env.JWT_PUBLIC_SECRET_KEY),
        refreshTokenSecretKey: String(process.env.JWT_REFRESH_TOKEN_SECRET_KEY),
        refreshTokenTtl: Number(process.env.JWT_REFRESH_TOKEN_TTL),
        accessTokenSecretKey: String(process.env.JWT_ACCESS_TOKEN_SECRET_KEY),
        accessTokenTtl: Number(process.env.JWT_ACCESS_TOKEN_TTL),
    },
    mail: {
        user: String(process.env.MAIL_USER),
        password: String(process.env.MAIL_PASS),
    },
    frontendUrls: {
        staffOrAdmin: String(process.env.STAFF_OR_ADMIN_FE_URL),
        reader: String(process.env.READER_FE_URL),
    },
    production: process.env.NODE_ENV === 'production'
};
