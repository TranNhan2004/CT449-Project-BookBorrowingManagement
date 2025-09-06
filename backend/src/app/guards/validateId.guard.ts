import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";

export function validateIdGuard() {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!isValidObjectId(req.params.id)) {
            return next("route");
        }
        return next();
    }
}
