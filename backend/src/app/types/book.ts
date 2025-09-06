import type { Document } from "mongoose";
import type { IAuthor } from "./author";
import type { IPublisher } from "./publisher";
import type { ITopic } from "./topic";
import type { IUser } from "./user";
import type { ILanguage } from "./language";

export interface IBook extends Document {
    publicId: string;
    title: string;
    authors: IAuthor[];
    topics: ITopic[]; // first topic is the main topic
    publisher: IPublisher;
    addedBy: IUser;
    language: ILanguage;
    imageUrl: string;
    price: number;
    publishedYear: number;
    numbers: number;
    availableNumbers: number;
    description: string | null;
    averageRating: number;
    createdAt: Date;
    updatedAt: Date;
}
