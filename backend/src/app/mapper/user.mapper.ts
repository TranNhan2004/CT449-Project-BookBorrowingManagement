import { ObjectId } from "mongoose";
import { IReadReader, IReadStaffOrAdmin, IUser } from "../types/user";

class UserMapper {
    constructor() { }

    toIReadReader(data: IUser): IReadReader {
        return {
            _id: (data._id as ObjectId).toString(),
            phone: data.phone,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            birthDate: data.birthDate,
            gender: data.gender,
            address: data.address,
            role: data.role,
            points: data.points,
            rank: data.rank,
            currentBorrowingQuantity: data.currentBorrowingQuantity,
            currentReservationQuantity: data.currentReservationQuantity,
            isActive: data.isActive,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            lastLogin: data.lastLogin
        }
    }

    toIReadStaffOrAdmin(data: IUser): IReadStaffOrAdmin {
        return {
            _id: (data._id as ObjectId).toString(),
            phone: data.phone,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            birthDate: data.birthDate,
            gender: data.gender,
            address: data.address,
            role: data.role,
            isActive: data.isActive,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            lastLogin: data.lastLogin
        }
    }
}

export const userMapper = new UserMapper();
