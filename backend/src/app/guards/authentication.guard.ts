import { Request, Response, NextFunction } from "express";
import { appConfig } from "../config";
import { HttpStatus } from "../utils/http.util";
import jwt from "jsonwebtoken";

export function authenticationGuard() {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers["authorization"];
            if (!authHeader?.startsWith("Bearer ")) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
            }

            const token = authHeader.split(" ")[1] || "";
            const decoded = jwt.verify(token, appConfig.jwt.accessTokenSecretKey);

            req.user = decoded as Express.UserPayload;

            return next();
        } catch {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        }
    };
}
