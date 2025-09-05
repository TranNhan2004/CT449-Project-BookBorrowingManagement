export interface AppConfig {
    app: { port: number };
    db: { url: string };
    production: boolean;
    jwt: {
        publicSecretKey: string;
        accessTokenSecretKey: string;
        accessTokenTtl: number;
        refreshTokenSecretKey: string;
        refreshTokenTtl: number;
    },
    mail?: { user: string; password: string }
    frontendUrls?: { [k: string]: string }
}
