import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../utils/http.util";
import { RoleEnum } from "../enum";

export function authorizationGuard(allowedRoles: RoleEnum[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;

            if (!user) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(HttpStatus.FORBIDDEN).json({ message: "Forbidden" });
            }

            return next();
        } catch {
            return res.status(HttpStatus.FORBIDDEN).json({ message: "Forbidden" });
        }
    };
}
