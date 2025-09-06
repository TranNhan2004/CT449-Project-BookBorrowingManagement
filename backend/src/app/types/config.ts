export interface AppConfig {
    app: { port: number };
    db: { url: string };
    production: boolean;
    frontendUrls: { [k: string]: string }
    jwt: {
        publicSecretKey: string;
        accessTokenSecretKey: string;
        accessTokenTtl: number;
        refreshTokenSecretKey: string;
        refreshTokenTtl: number;
    },
    email?: { user: string; password: string }
}
