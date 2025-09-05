import { model, Schema } from "mongoose";
import type { IPublisher } from "../interfaces/publisher";
import { publisherMessages } from "../messages/vi.message";

const T = Schema.Types;

const PublisherSchema = new Schema<IPublisher>({
    publicId: {
        type: T.String,
        index: true,
        required: [true, publisherMessages.requiredName()],
        unique: [true, publisherMessages.existedPublicId()],
        match: [/^[A-Za-z0-9]{5}$/, publisherMessages.invalidPublicId()],
    },
    name: {
        type: T.String,
        required: [true, publisherMessages.requiredName()],
    },
    description: {
        type: T.String,
        default: null,
    }
});

export const Publisher = model<IPublisher>('Publisher', PublisherSchema);
