import type { Document } from "mongoose";

export interface IPublisher extends Document {
    publicId: string;
    name: string;
    description: string | null;
}

export interface ICreatePublisher extends Pick<IPublisher, 'publicId' | 'name' | 'description'> { }
export interface IUpdatePublisher extends Pick<IPublisher, 'publicId' | 'name' | 'description'> { }
export interface IReadPublisher extends Pick<IPublisher, '_id' | 'publicId' | 'name' | 'description'> { }
