import type { Request, Response, NextFunction } from "express";
import { authenticationService } from "../services/authentication.service";
import { CookieHelpers } from "../utils/cookie.util";
import { HttpStatus } from "../utils/http.util";
import { appConfig } from "../config/index";
import { RoleEnum } from "../enum/index";
import { ApiError } from "../utils/error.util";
import { userMessages } from "../messages/vi.message";
import { StringHelpers } from "../utils/string.util";
import { Controller } from "../utils/controller.util";

@Controller
class AuthenticationController {
    private staffOrAdminRTCookieName = '__SorA_RT__';
    private staffOrAdminATCookieName = '__SorA_AT__';
    private staffOrAdminInfoCookieName = '__SorA_Info__';
    private readerRTCookieName = '__R_RT__';
    private readerATCookieName = '__R_AT__';
    private readerInfoCookieName = '__R_Info__';

    constructor() { }

    private getCookieNames(role: RoleEnum): [string, string, string] {
        if (role === RoleEnum.Admin || role === RoleEnum.Staff) {
            return [this.staffOrAdminRTCookieName, this.staffOrAdminATCookieName, this.staffOrAdminInfoCookieName]
        }

        if (role === RoleEnum.Reader) {
            return [this.readerRTCookieName, this.readerATCookieName, this.readerInfoCookieName]
        }

        throw new ApiError(HttpStatus.BAD_REQUEST, userMessages.invalidRole());
    }

    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await authenticationService.signup(StringHelpers.trimObject(req.body));
            return res.status(HttpStatus.CREATED).json(user);
        } catch (err) {
            next(err);
        }
    }

    async sendVerificationLink(req: Request, res: Response, next: NextFunction) {
        try {
            await authenticationService.sendVerificationLink(StringHelpers.trimObject(req.body));
            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

    async verifyAccount(req: Request, res: Response, next: NextFunction) {
        try {
            await authenticationService.verifyAccount(StringHelpers.trimObject(req.body));
            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { accessToken, refreshToken, user } = await authenticationService.login(StringHelpers.trimObject(req.body));
            const cookieNames = this.getCookieNames(user.role);

            CookieHelpers.setCookie(res, cookieNames[0], refreshToken, {
                httpOnly: true,
                secure: appConfig.production,
                sameSite: appConfig.production ? "none" : "lax",
                path: "/api/auth/refresh",
                maxAgeMs: appConfig.jwt.refreshTokenTtl * 1000,
            });

            CookieHelpers.setCookie(res, cookieNames[1], accessToken, {
                httpOnly: false,
                secure: appConfig.production,
                sameSite: appConfig.production ? "none" : "lax",
                path: "/api",
                maxAgeMs: appConfig.jwt.accessTokenTtl * 1000,
            });

            CookieHelpers.setCookie(res, cookieNames[2], JSON.stringify(user), {
                httpOnly: false,
                secure: appConfig.production,
                sameSite: appConfig.production ? "none" : "lax",
                path: "/api",
                maxAgeMs: appConfig.jwt.refreshTokenTtl * 1000,
            });

            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { role } = req.query;
            const cookieNames = this.getCookieNames(role as RoleEnum);
            const refreshToken = CookieHelpers.getCookie(req, cookieNames[0]) || '';

            const { accessToken } = await authenticationService.refresh({ refreshToken });
            CookieHelpers.setCookie(res, cookieNames[1], accessToken, {
                httpOnly: false,
                secure: appConfig.production,
                sameSite: appConfig.production ? "none" : "lax",
                path: "/api",
                maxAgeMs: appConfig.jwt.accessTokenTtl * 1000,
            });

            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { role } = req.query;
            const cookieNames = this.getCookieNames(role as RoleEnum);
            CookieHelpers.clearCookie(res, cookieNames[0]);
            CookieHelpers.clearCookie(res, cookieNames[1]);
            CookieHelpers.clearCookie(res, cookieNames[2]);
            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }
}

export const authenticationController = new AuthenticationController();
