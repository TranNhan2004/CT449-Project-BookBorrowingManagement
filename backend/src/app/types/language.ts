import type { Document } from "mongoose";

export interface ILanguage extends Document {
    publicId: string;
    name: string;
}

export interface ICreateLanguage extends Pick<ILanguage, 'publicId' | 'name'> { }
export interface IUpdateLanguage extends Pick<ILanguage, 'publicId' | 'name'> { }
export interface IReadLanguage extends Pick<ILanguage, '_id' | 'publicId' | 'name'> { }
