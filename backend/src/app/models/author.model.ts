import { model, Schema } from "mongoose";
import type { IAuthor } from "../interfaces/author";
import { authorMessages } from "../messages/vi.message";

const T = Schema.Types;

const AuthorSchema = new Schema<IAuthor>({
    publicId: {
        type: T.String,
        index: true,
        required: [true, authorMessages.requiredName()],
        unique: [true, authorMessages.existedPublicId()],
        match: [/^[A-Za-z0-9]{5}$/, authorMessages.invalidPublicId()],
    },
    name: {
        type: T.String,
        required: [true, authorMessages.requiredName()],
    },
    description: {
        type: T.String,
        default: null,
    }
});

export const Author = model<IAuthor>('Author', AuthorSchema);
