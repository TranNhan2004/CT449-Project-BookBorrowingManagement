import "express";
import { RoleEnum } from "../enum";

declare global {
    namespace Express {
        interface UserPayload {
            userId: string;
            role: RoleEnum;
        }

        interface Request {
            user?: UserPayload;
        }
    }
}
