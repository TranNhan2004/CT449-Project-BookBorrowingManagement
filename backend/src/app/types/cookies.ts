export interface MyCookieOptions {
    httpOnly: boolean;
    maxAge: number;
    path: string;
    secure: boolean;
    sameSite: "lax" | "strict" | "none";
}
