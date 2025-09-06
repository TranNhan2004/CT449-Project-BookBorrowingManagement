import { userMessages } from '../messages/vi.message';
import { GenderEnum, RankEnum, RoleEnum } from '../enum/index';
import { Schema, model } from "mongoose";
import { IUser } from '../types/user';
import { pattern } from '../const/index';
import { ApiError } from '../utils/error.util';
import { HttpStatus } from '../utils/http.util';

const T = Schema.Types;

const today = new Date();
const minDate = new Date(today);
minDate.setFullYear(minDate.getFullYear() - 100);
const maxDate = new Date(today);
maxDate.setFullYear(maxDate.getFullYear() - 5);

const UserSchema = new Schema<IUser>(
    {
        phone: {
            type: T.String,
            index: true,
            unique: true,
            required: [true, userMessages.requiredPhone()],
            minlength: [10, userMessages.phoneMinLength(10)],
            match: [pattern.phone, userMessages.phoneFormat()],
        },
        email: {
            type: T.String,
            index: true,
            unique: true,
            required: [true, userMessages.requiredEmail()],
            match: [pattern.email, userMessages.emailFormat()],
        },
        password: {
            type: T.String,
            required: true,
        },
        firstName: {
            type: T.String,
            required: [true, userMessages.requiredFirstName()],
        },
        lastName: {
            type: T.String,
            required: [true, userMessages.requiredLastName()]
        },
        birthDate: {
            type: T.Date,
            required: [true, userMessages.requiredBirthDate()],
            min: [minDate, userMessages.invalidBirthDate()],
            max: [maxDate, userMessages.invalidBirthDate()],
        },
        gender: {
            type: T.String,
            enum: Object.values(GenderEnum),
            required: [true, userMessages.requiredGender()],
            validate: {
                validator: (val: string) => (Object.values(GenderEnum) as string[]).includes(val),
                message: userMessages.invalidGender()
            }
        },
        address: {
            type: T.String,
            required: [true, userMessages.requiredAddress()]
        },
        points: {
            type: T.Number,
            default: 0,
            min: 0,
        },
        rank: {
            type: T.String,
            default: RankEnum.Basic,
        },
        currentReservationQuantity: {
            type: T.Number,
            min: 0,
            max: 3,
            default: 0,
        },
        currentBorrowingQuantity: {
            type: T.Number,
            min: 0,
            max: 5,
            default: 0,
        },
        role: {
            type: T.String,
            enum: Object.values(RoleEnum),
            required: [true, userMessages.requiredRole()],
            validate: {
                validator: (val: string) => (Object.values(RoleEnum) as string[]).includes(val),
                message: userMessages.invalidRole()
            }
        },
        isActive: {
            type: T.Boolean,
            default: false,
            required: true,
        },
        lastLogin: {
            type: T.Date,
            default: null,
        },
    },
    {
        timestamps: true
    }
);

const errorsMap: Record<string, string> = {
    email: userMessages.existedEmail(),
    phone: userMessages.existedPhone()
};

UserSchema.post(['save', 'insertMany', 'updateOne'] as any, function (err: any, doc: any, next: any) {
    if (err?.code === 11000) {
        const field = Object.keys(err.keyPattern)[0] as string;
        const message = errorsMap[field] || `${field} already exists`;
        return next(new ApiError(HttpStatus.CONFLICT, message));
    }
    next(err);
});

export const User = model<IUser>('User', UserSchema);
