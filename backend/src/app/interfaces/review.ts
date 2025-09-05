import type { Document } from "mongoose";
import type { IUser } from "./user";
import type { IBook } from "./book";

export interface IReview extends Document {
    reader: IUser;
    book: IBook;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}
