import type { Document, ObjectId } from "mongoose";
import type { GenderEnum, RankEnum, RoleEnum } from "../enum/index";

export interface IRankInfo {
    minPoints: number;
    maxExtensionDays: number;
    maxReservationDays: number;
}

export interface IUser extends Document {
    phone: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    gender: GenderEnum;
    address: string;
    points: number;
    rank: RankEnum;
    currentReservationQuantity: number;
    currentBorrowingQuantity: number;
    role: RoleEnum;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date | null;
}

export interface ICreateUser extends Pick<
    IUser,
    'phone'
    | 'email'
    | 'password'
    | 'firstName'
    | 'lastName'
    | 'birthDate'
    | 'gender'
    | 'address'
    | 'role'
> {
    confirmPassword: IUser['password'];
}

export interface IUpdateUserInfo extends Pick<
    IUser,
    'phone'
    | 'email'
    | 'firstName'
    | 'lastName'
    | 'birthDate'
    | 'gender'
    | 'address'
> { }

export interface IUpdatePassword {
    oldPassword: IUser['password'];
    newPassword: IUser['password'];
    confirmNewPassword: IUser['password'];
}

export interface IRequestPasswordReset extends Pick<IUser, 'email'> { }
export interface IResetPassword extends Pick<IUpdatePassword, 'newPassword' | 'confirmNewPassword'> {
    token: string;
}

export interface IRequestAccountVerify extends Pick<IUser, 'email'> { }
export interface IVerifyAccount {
    token: string;
}

export interface IReadReader extends Pick<
    IUser,
    '_id'
    | 'phone'
    | 'email'
    | 'firstName'
    | 'lastName'
    | 'birthDate'
    | 'gender'
    | 'address'
    | 'points'
    | 'rank'
    | 'currentBorrowingQuantity'
    | 'currentReservationQuantity'
    | 'role'
    | 'isActive'
    | 'createdAt'
    | 'updatedAt'
    | 'lastLogin'
> { }

export interface IReadStaffOrAdmin extends Pick<
    IUser,
    '_id'
    | 'phone'
    | 'email'
    | 'firstName'
    | 'lastName'
    | 'birthDate'
    | 'gender'
    | 'address'
    | 'role'
    | 'isActive'
    | 'createdAt'
    | 'updatedAt'
    | 'lastLogin'
> { }

export interface ILogin extends Pick<IUser, 'email' | 'password'> { }
export interface ILoginResponse {
    refreshToken: string,
    accessToken: string,
    user: IReadReader | IReadStaffOrAdmin
}

export interface IRefresh {
    refreshToken: string;
}
export interface IRefreshResponse {
    accessToken: string,
    user: IReadReader | IReadStaffOrAdmin
}
