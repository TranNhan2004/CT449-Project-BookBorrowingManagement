import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import { HttpStatus } from "../utils/http.util";
import { StringHelpers } from "../utils/string.util";
import { Controller } from "../utils/controller.util";

@Controller
class UserController {
    constructor() { }

    async findAllReader(req: Request, res: Response, next: NextFunction) {
        try {
            const readers = await userService.findAllReader(req.query || {});
            return res.status(HttpStatus.OK).json(readers);
        } catch (err) {
            next(err);
        }
    }

    async findAllStaffOrAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.findAllStaffOrAdmin(req.query || {});
            return res.status(HttpStatus.OK).json(users);
        } catch (err) {
            next(err);
        }
    }

    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await userService.findById(req.params.id || '');
            return res.status(HttpStatus.OK).json(user);
        } catch (err) {
            next(err);
        }
    }

    async updateUserInfo(req: Request, res: Response, next: NextFunction) {
        try {
            await userService.updateUserInfo(req.params.id || '', StringHelpers.trimObject(req.body));
            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

    async updatePassword(req: Request, res: Response, next: NextFunction) {
        try {
            await userService.updatePassword(req.params.id || '', StringHelpers.trimObject(req.body));
            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

    async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
        try {
            await userService.requestPasswordReset(StringHelpers.trimObject(req.body));
            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            await userService.resetPassword(StringHelpers.trimObject(req.body));
            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await userService.delete(req.params.id || '');
            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }
}

export const userController = new UserController();
