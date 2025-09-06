import { User } from "../models/user.model";
import { ApiError, CatchMongooseErrors } from "../utils/error.util";
import { PasswordHelpers } from "../utils/password.util";
import { userMessages } from "../messages/vi.message";
import { HttpStatus } from "../utils/http.util";
import { userMapper } from "../mapper/user.mapper";
import { RoleEnum } from "../enum/index";
import { appConfig } from "../config/index";
import jwt from "jsonwebtoken";
import type {
    ICreateUser,
    ILogin,
    ILoginResponse,
    IReadReader,
    IReadStaffOrAdmin,
    IRefresh,
    IRefreshResponse,
    IRequestAccountVerify,
    IVerifyAccount
} from "../types/user";
import { pattern } from "../const";
import { emailService } from "./email.service";

@CatchMongooseErrors
class AuthenticationService {
    constructor() { }

    private async isStrongPassword(password: string | undefined) {
        switch (await PasswordHelpers.checkStrongPassword(password, 8, 20, pattern.password)) {
            case 1:
                return true;
            case -1:
                throw new ApiError(
                    HttpStatus.BAD_REQUEST,
                    userMessages.requiredPassword(),
                    { field: 'password' }
                );
            case -2:
                throw new ApiError(
                    HttpStatus.BAD_REQUEST,
                    userMessages.passwordMinLength(8),
                    { field: 'password' }
                );
            case -3:
                throw new ApiError(
                    HttpStatus.BAD_REQUEST,
                    userMessages.passwordMaxLength(20),
                    { field: 'password' }
                );
            case -4:
                throw new ApiError(
                    HttpStatus.BAD_REQUEST,
                    userMessages.passwordFormat(),
                    { field: 'password' }
                );
        }
    }

    async signupForReader(data: ICreateUser): Promise<IReadReader> {
        await this.isStrongPassword(data.password);

        const hashedPassword = await PasswordHelpers.hash(data.password);

        const user = await User.create({
            ...data,
            password: hashedPassword,
        });

        return userMapper.toIReadReader(user.toObject());
    }

    async signupForStaff(data: ICreateUser): Promise<IReadStaffOrAdmin> {
        await this.isStrongPassword(data.password);

        const hashedPassword = await PasswordHelpers.hash(data.password);

        const user = await User.create({
            ...data,
            password: hashedPassword,
            isActive: true,
        });

        return userMapper.toIReadStaffOrAdmin(user.toObject());

    }

    async sendVerificationLink(data: IRequestAccountVerify) {
        const user = await User.findOne({ email: data.email }).orFail();

        if (user.isActive) {
            throw new ApiError(HttpStatus.BAD_REQUEST, userMessages.alreadyActivated());
        }

        const seconds = 60 * 60 * 24;
        const token = jwt.sign({ userId: user._id }, appConfig.jwt.publicSecretKey, {
            expiresIn: seconds,
        });

        const url = user.role === RoleEnum.Reader
            ? appConfig.frontendUrls?.reader
            : appConfig.frontendUrls?.staffOrAdmin;

        const verifyLink = `${url}/verify?token=${token}`;

        await emailService.sendMail(
            data.email,
            "Xác thực tài khoản",
            `<p>Chào bạn,</p>
             <p>Bấm vào link sau để xác thực tài khoản:</p>
             <a href="${verifyLink}">${verifyLink}</a>
             <p>Link sẽ hết hạn sau ${Math.round(seconds / 3600)} giờ</p>`
        );
    }

    async verifyAccount(data: IVerifyAccount) {
        let payload: any;
        try {
            payload = jwt.verify(data.token, appConfig.jwt.publicSecretKey);
        } catch (err) {
            throw new ApiError(HttpStatus.UNAUTHORIZED, userMessages.invalidOrExpiredToken());
        }

        const user = await User.findById(payload.userId).orFail();

        if (user.isActive) {
            throw new ApiError(HttpStatus.BAD_REQUEST, userMessages.alreadyActivated());
        }

        user.isActive = true;
        await user.save();
    }

    async login(data: ILogin): Promise<ILoginResponse> {
        const user = await User.findOne({ email: data.email }).orFail();

        const isValid = await PasswordHelpers.compare(data.password, user.password);
        if (!isValid || !user.isActive || data.role !== user.role) {
            throw new ApiError(HttpStatus.UNAUTHORIZED, userMessages.incorrectEmailOrPassword());
        }

        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            appConfig.jwt.accessTokenSecretKey,
            { expiresIn: appConfig.jwt.accessTokenTtl }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            appConfig.jwt.refreshTokenSecretKey,
            { expiresIn: appConfig.jwt.refreshTokenTtl }
        );

        return {
            accessToken,
            refreshToken,
            user: user.role === RoleEnum.Reader
                ? userMapper.toIReadReader(user.toObject())
                : userMapper.toIReadStaffOrAdmin(user.toObject()),
        };
    }

    async refresh(data: IRefresh): Promise<IRefreshResponse> {
        let payload: any;
        try {
            payload = jwt.verify(data.refreshToken, appConfig.jwt.refreshTokenSecretKey);
        } catch (err) {
            throw new ApiError(HttpStatus.UNAUTHORIZED, userMessages.invalidOrExpiredToken());
        }

        const user = await User.findById(payload.userId).orFail();

        const newAccessToken = jwt.sign(
            { userId: user._id, role: user.role },
            appConfig.jwt.accessTokenSecretKey,
            { expiresIn: appConfig.jwt.accessTokenTtl }
        );

        return {
            accessToken: newAccessToken,
            user: userMapper.toIReadReader(user.toObject()),
        };
    }

    async logout() { }
}

export const authenticationService = new AuthenticationService();
