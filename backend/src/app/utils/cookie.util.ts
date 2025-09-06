import { Response, Request } from "express";
import { MyCookieOptions } from "../types/cookies";

export class CookieHelpers {
    static setCookie(
        res: Response,
        name: string,
        value: string,
        options: MyCookieOptions
    ) {
        res.cookie(name, value, options);
    }

    static getCookie(req: Request, name: string): string | undefined {
        return req.cookies?.[name];
    }

    static clearCookie(
        res: Response,
        name: string,
        options?: MyCookieOptions
    ) {
        res.clearCookie(name, options);
    }
}
