import type { Response, Request } from "express";

export class CookieHelpers {
    static setCookie(
        res: Response,
        name: string,
        value: string,
        options: {
            httpOnly: boolean;
            maxAgeMs: number;
            path: string;
            secure: boolean;
            sameSite: "lax" | "strict" | "none";
        }
    ) {
        res.cookie(name, value, {
            httpOnly: true,
            secure: options.secure,
            sameSite: options.sameSite,
            path: options.path,
            maxAge: options.maxAgeMs,
        });
    }

    static getCookie(req: Request, name: string): string | undefined {
        return req.cookies?.[name];
    }

    static clearCookie(
        res: Response,
        name: string,
    ) {
        res.clearCookie(name);
    }
}
