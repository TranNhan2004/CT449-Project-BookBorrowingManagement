import mongoose from "mongoose";
import { HttpStatus } from "./http.util";
import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {
    statusCode: number;
    details: unknown | null;

    constructor(statusCode: number, message: string, details: unknown | null = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}

function handleMongooseError(err: any): ApiError {
    switch (true) {
        case err instanceof ApiError:
            return err;
        case err instanceof mongoose.Error.ValidationError:
            return new ApiError(HttpStatus.BAD_REQUEST, err.errors[0]?.message as string, { field: err.errors[0]?.path });
        case err instanceof mongoose.Error.CastError:
            return new ApiError(HttpStatus.BAD_REQUEST, `Lỗi ép kiểu tại trường "${err.path}"`, { field: err.path, value: err.value });
        case err instanceof mongoose.Error.VersionError: {
            const e = err as mongoose.Error.VersionError & { model?: { modelName: string }; version: number };
            return new ApiError(HttpStatus.CONFLICT, "Xung đột version", { model: e.model?.modelName, version: e.version });
        }
        case err instanceof mongoose.Error.DocumentNotFoundError: {
            const e = err as mongoose.Error.DocumentNotFoundError & { model?: { modelName: string }; filter?: unknown };
            return new ApiError(HttpStatus.NOT_FOUND, "Không tìm thấy tài liệu", { model: e.model?.modelName, filter: e.filter });
        }
        case err.message?.includes("timed out"):
            return new ApiError(HttpStatus.SERVICE_UNAVAILABLE, "Yêu cầu đến CSDL bị hết thời gian chờ");
        case err.message?.includes("ECONNREFUSED") || err.message?.includes("network error"):
            return new ApiError(HttpStatus.SERVICE_UNAVAILABLE, "Lỗi kết nối CSDL");
        default:
            return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", { original: err.message });
    }
}

export function CatchMongooseErrors<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            const propertyNames = Object.getOwnPropertyNames(constructor.prototype);

            for (const name of propertyNames) {
                const descriptor = Object.getOwnPropertyDescriptor(constructor.prototype, name);
                if (!descriptor) continue;
                const isMethod = typeof descriptor.value === "function" && name !== "constructor";
                if (!isMethod) continue;

                const originalMethod = descriptor.value;
                Object.defineProperty(this, name, {
                    value: async (...methodArgs: any[]) => {
                        try {
                            return await originalMethod.apply(this, methodArgs);
                        } catch (err) {
                            throw handleMongooseError(err);
                        }
                    },
                });
            }
        }
    };
}

export function globalErrorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    console.error(err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            message: err.message,
            details: err.details ?? null,
        });
    }

    if (err instanceof Error) {
        return res.status(500).json({
            message: err.message,
            details: null,
        });
    }

    return res.status(500).json({
        message: "Internal Server Error",
        details: null,
    });
}
