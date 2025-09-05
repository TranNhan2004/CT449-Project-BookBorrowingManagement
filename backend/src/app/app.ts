import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/user.route';
import { authenticationRouter } from './routes/authentication.route';
import { globalErrorHandler } from './utils/error.util';
import morgan from 'morgan';

function createApp() {
    const app = express();

    app.use(cookieParser());
    app.use(express.json());
    app.use(morgan('dev'));
    app.use(cors({
        credentials: true
    }));

    app.use('/api/auth', authenticationRouter);
    app.use('/api/users', userRouter);

    app.use(globalErrorHandler);
    return app;
}

export const app = createApp();
