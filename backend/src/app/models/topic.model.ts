import { model, Schema } from "mongoose";
import type { ITopic } from "../interfaces/topic";
import { topicMessages } from "../messages/vi.message";

const T = Schema.Types;

const TopicSchema = new Schema<ITopic>({
    publicId: {
        type: T.String,
        index: true,
        unique: [true, topicMessages.existedPublicId()],
        required: [true, topicMessages.requiredPublicId()],
        match: [/^[A-Za-z0-9]{5}$/, topicMessages.invalidPublicId()],
    },
    name: {
        type: T.String,
        index: true,
        unique: [true, topicMessages.existedName()],
        required: [true, topicMessages.requiredName()],
    },
});

export const Topic = model<ITopic>('Topic', TopicSchema);
