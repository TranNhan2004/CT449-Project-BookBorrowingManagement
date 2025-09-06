import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { userRouter } from './routes/user.route';
import { authenticationRouter } from './routes/authentication.route';
import { globalErrorHandler } from './utils/error.util';
import { appConfig } from './config';


function createApp() {
    const app = express();

    app.use(cookieParser());
    app.use(express.json());
    app.use(morgan('dev'));
    app.use(cors({
        origin: Object.values(appConfig.frontendUrls),
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));


    app.use('/api/auth', authenticationRouter);
    app.use('/api/users', userRouter);

    app.use(globalErrorHandler);
    return app;
}

export const app = createApp();
