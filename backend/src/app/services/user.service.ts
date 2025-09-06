import { RoleEnum } from "../enum/index";
import type { ICreateUser, IReadReader, IReadStaffOrAdmin, IRequestPasswordReset, IResetPassword, IUpdatePassword, IUpdateUserInfo, IUser } from "../types/user";
import { User } from "../models/user.model";
import { ApiError, CatchMongooseErrors } from "../utils/error.util";
import { userMapper } from "../mapper/user.mapper";
import { PasswordHelpers } from "../utils/password.util";
import { userMessages } from "../messages/vi.message";
import { HttpStatus } from "../utils/http.util";
import { pattern } from "../const/index";
import { emailService } from "./email.service";
import { appConfig } from "../config/index";
import jwt from 'jsonwebtoken';

@CatchMongooseErrors
class UserService {
    constructor() { }

    private async isStrongNewPassword(newPassword: string | undefined) {
        switch (await PasswordHelpers.checkStrongPassword(newPassword, 8, 20, pattern.password)) {
            case 1:
                return true;
            case -1:
                throw new ApiError(
                    HttpStatus.BAD_REQUEST,
                    userMessages.requiredNewPassword(),
                    { field: 'newPassword' }
                );
            case -2:
                throw new ApiError(
                    HttpStatus.BAD_REQUEST,
                    userMessages.passwordMinLength(8),
                    { field: 'newPassword' }
                );
            case -3:
                throw new ApiError(
                    HttpStatus.BAD_REQUEST,
                    userMessages.passwordMaxLength(20),
                    { field: 'newPassword' }
                );
            case -4:
                throw new ApiError(
                    HttpStatus.BAD_REQUEST,
                    userMessages.newPasswordFormat(),
                    { field: 'newPassword' }
                );
        }
    }

    async findAllReader(filter: Record<string, any> = {}) {
        return (await User.find({ ...filter, role: RoleEnum.Reader }).lean())
            .map((i: IUser) => userMapper.toIReadReader(i));
    }

    async findAllStaffOrAdmin(filter: Record<string, any> = {}) {
        return (await User.find({ ...filter, role: { $in: [RoleEnum.Staff, RoleEnum.Admin] } }).lean())
            .map((i: IUser) => userMapper.toIReadStaffOrAdmin(i));
    }

    async findById(id: string): Promise<IReadReader | IReadStaffOrAdmin> {
        const user = await User.findById(id).lean().orFail();
        return user.role === RoleEnum.Reader
            ? userMapper.toIReadReader(user)
            : userMapper.toIReadStaffOrAdmin(user);
    }

    async updateUserInfo(id: string, data: IUpdateUserInfo) {
        let user = await User.findById(id).orFail();
        Object.assign(user, data);
        await user.save();
    }

    async updatePassword(id: string, data: IUpdatePassword) {
        let user = await User.findById(id).orFail();

        if (!(await PasswordHelpers.compare(data.oldPassword, user.password))) {
            throw new ApiError(
                HttpStatus.BAD_REQUEST,
                userMessages.incorrectOldPassword(),
                { field: 'oldPassword' }
            );
        }

        await this.isStrongNewPassword(data.newPassword);

        if (data.newPassword !== data.confirmNewPassword) {
            throw new ApiError(
                HttpStatus.BAD_REQUEST,
                userMessages.confirmNewPasswordMismatch(),
                { field: 'confirmNewPassword' }
            )
        }

        user.password = await PasswordHelpers.hash(data.newPassword);
        await user.save();
    }

    async requestPasswordReset(data: IRequestPasswordReset) {
        const user = await User.findOne({ email: data.email }).orFail();
        const seconds = 600;

        const token = jwt.sign({ userId: user._id }, appConfig.jwt.publicSecretKey, {
            expiresIn: seconds,
        });

        const url = user.role === RoleEnum.Reader
            ? appConfig.frontendUrls?.reader
            : appConfig.frontendUrls?.staffOrAdmin;

        const resetLink = `${url} / reset ? token = ${token}`;

        await emailService.sendMail(
            user.email,
            "Đặt lại mật khẩu",
            `< p > Bấm vào link để đặt lại mật khẩu: </p>
            < a href = "${resetLink}" > ${resetLink} </a>
            < p > Link sẽ hết hạn sau ${Math.round(seconds / 60)} phút </p>`

        );
    }

    async resetPassword(data: IResetPassword) {
        let payload: any;
        try {
            payload = jwt.verify(data.token, appConfig.jwt.publicSecretKey);
        } catch (err) {
            throw new ApiError(HttpStatus.BAD_REQUEST, userMessages.invalidOrExpiredToken());
        }

        let user = await User.findById(payload.userId).orFail();

        await this.isStrongNewPassword(data.newPassword);
        if (data.newPassword !== data.confirmNewPassword) {
            throw new ApiError(
                HttpStatus.BAD_REQUEST,
                userMessages.confirmNewPasswordMismatch(),
                { field: 'confirmNewPassword' }
            )
        }

        user.password = await PasswordHelpers.hash(data.newPassword);
        await user.save();
    }

    async delete(id: string) {
        await User.deleteOne({ _id: id }).orFail();
    }

}

export const userService = new UserService();
