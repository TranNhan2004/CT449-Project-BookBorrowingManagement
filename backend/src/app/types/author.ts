import type { Document } from "mongoose";

export interface IAuthor extends Document {
    publicId: string;
    name: string;
    description: string | null;
}

export interface ICreateAuthor extends Pick<IAuthor, 'publicId' | 'name' | 'description'> { }
export interface IUpdateAuthor extends Pick<IAuthor, 'publicId' | 'name' | 'description'> { }
export interface IReadAuthor extends Pick<IAuthor, '_id' | 'publicId' | 'name' | 'description'> { }
