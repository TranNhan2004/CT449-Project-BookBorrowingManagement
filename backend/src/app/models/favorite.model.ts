import { model, Schema } from "mongoose";
import { favoriteMessages } from "../messages/vi.message";
import type { IFavorite } from "../interfaces/favorite";

const T = Schema.Types;

const FavoriteSchema = new Schema<IFavorite>({
    reader: {
        type: T.ObjectId,
        ref: 'User',
        required: [true, favoriteMessages.requiredReader()],
    },
    book: {
        type: T.ObjectId,
        ref: 'Book',
        required: [true, favoriteMessages.requiredBook()],
    }
});

FavoriteSchema.index({ reader: 1, book: 1 }, { unique: true });

export const Favorite = model<IFavorite>('Favorite', FavoriteSchema);

