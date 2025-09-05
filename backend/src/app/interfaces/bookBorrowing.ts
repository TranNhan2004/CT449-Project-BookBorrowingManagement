import type { Document } from "mongoose";
import type { IUser } from "./user";
import type { IBook } from "./book";

export interface IBookBorrowing extends Document {
    borrowedBy: IUser;
    borrowedBook: IBook;
    addedBy: IUser;
    borrowedDate: Date;
    dueDate: Date;
    returnedDate: Date | null;
}
