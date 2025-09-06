import type { Document } from "mongoose";
import type { IUser } from "./user";
import type { IBook } from "./book";

export interface IReservation extends Document {
    reservedBy: IUser;
    reservedBook: IBook;
    reservedDate: Date;
    dueDate: Date;
}
