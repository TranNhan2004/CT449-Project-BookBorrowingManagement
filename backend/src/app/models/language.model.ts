import { model, Schema } from "mongoose";
import { ILanguage } from "../types/language";
import { languageMessages } from "../messages/vi.message";

const T = Schema.Types;

const LanguageSchema = new Schema<ILanguage>({
    publicId: {
        type: T.String,
        index: true,
        unique: [true, languageMessages.existedPublicId()],
        required: [true, languageMessages.requiredPublicId()],
        match: [/^[A-Za-z0-9]{5}$/, languageMessages.invalidPublicId()],
    },
    name: {
        type: T.String,
        index: true,
        unique: [true, languageMessages.existedName()],
        required: [true, languageMessages.requiredName()],
    },
});

export const Language = model<ILanguage>('Language', LanguageSchema);
