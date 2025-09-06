import { Request, Response, NextFunction } from "express";
import { authenticationService } from "../services/authentication.service";
import { CookieHelpers } from "../utils/cookie.util";
import { HttpStatus } from "../utils/http.util";
import { appConfig } from "../config/index";
import { RoleEnum } from "../enum/index";
import { ApiError } from "../utils/error.util";
import { userMessages } from "../messages/vi.message";
import { Controller } from "../utils/controller.util";
import { MyCookieOptions } from "../types/cookies";

@Controller
class AuthenticationController {
    private staffOrAdminRTCookieName = '__SorA_RT__';
    private staffOrAdminATCookieName = '__SorA_AT__';
    private readerRTCookieName = '__R_RT__';
    private readerATCookieName = '__R_AT__';

    constructor() { }

    private getCookieNames(role: RoleEnum): [string, string] {
        if (role === RoleEnum.Admin || role === RoleEnum.Staff) {
            return [this.staffOrAdminRTCookieName, this.staffOrAdminATCookieName]
        }

        if (role === RoleEnum.Reader) {
            return [this.readerRTCookieName, this.readerATCookieName]
        }

        throw new ApiError(HttpStatus.BAD_REQUEST, userMessages.invalidRole());
    }

    private getRTCookieOptions(): MyCookieOptions {
        return {
            httpOnly: true,
            secure: appConfig.production,
            sameSite: appConfig.production ? "none" : "lax",
            path: "/api/auth/refresh",
            maxAge: appConfig.jwt.refreshTokenTtl * 1000,
        }
    }

    private getATCookieOptions(): MyCookieOptions {
        return {
            httpOnly: false,
            secure: appConfig.production,
            sameSite: appConfig.production ? "none" : "lax",
            path: "/api",
            maxAge: appConfig.jwt.accessTokenTtl * 1000,
        }
    }

    async signupForReader(req: Request, res: Response, next: NextFunction) {
        try {
            const reader = await authenticationService.signupForReader(req.body);
            return res.status(HttpStatus.CREATED).json(reader);
        } catch (err) {
            next(err);
        }
    }

    async signupForStaff(req: Request, res: Response, next: NextFunction) {
        try {
            const staff = await authenticationService.signupForStaff(req.body);
            return res.status(HttpStatus.CREATED).json(staff);
        } catch (err) {
            next(err);
        }
    }

    async sendVerificationLink(req: Request, res: Response, next: NextFunction) {
        try {
            await authenticationService.sendVerificationLink(req.body);
            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

    async verifyAccount(req: Request, res: Response, next: NextFunction) {
        try {
            await authenticationService.verifyAccount(req.body);
            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { accessToken, refreshToken, user } = await authenticationService.login(req.body);
            const cookieNames = this.getCookieNames(user.role);
            CookieHelpers.setCookie(res, cookieNames[0], refreshToken, this.getRTCookieOptions());
            CookieHelpers.setCookie(res, cookieNames[1], accessToken, this.getATCookieOptions());

            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { role } = req.body;
            const cookieNames = this.getCookieNames(role as RoleEnum);
            const refreshToken = CookieHelpers.getCookie(req, cookieNames[0]) || '';

            const { accessToken } = await authenticationService.refresh({ refreshToken });
            CookieHelpers.setCookie(res, cookieNames[1], accessToken, this.getATCookieOptions());

            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { role } = req.body;
            const cookieNames = this.getCookieNames(role as RoleEnum);
            CookieHelpers.clearCookie(res, cookieNames[0], this.getRTCookieOptions());
            CookieHelpers.clearCookie(res, cookieNames[1], this.getATCookieOptions());
            await authenticationService.logout();
            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }
}

export const authenticationController = new AuthenticationController();
