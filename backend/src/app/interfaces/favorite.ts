import type { Document } from "mongoose";
import type { IUser } from "./user";
import type { IBook } from "./book";

export interface IFavorite extends Document {
    reader: IUser;
    book: IBook;
}
