import type { Document } from "mongoose";

export interface ITopic extends Document {
    publicId: string;
    name: string;
}

export interface ICreateTopic extends Pick<ITopic, 'publicId' | 'name'> { }
export interface IUpdateTopic extends Pick<ITopic, 'publicId' | 'name'> { }
export interface IReadTopic extends Pick<ITopic, '_id' | 'publicId' | 'name'> { }
