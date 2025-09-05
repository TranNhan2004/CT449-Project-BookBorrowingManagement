import { model, Schema } from "mongoose";
import { bookMessages } from "../messages/vi.message";
import type { IBook } from "../interfaces/book";

const T = Schema.Types;

const BookSchema = new Schema<IBook>(
    {
        publicId: {
            type: T.String,
            index: true,
            unique: true,
            required: true
        },
        title: {
            type: T.String,
            required: [true, bookMessages.requiredTitle()]
        },
        authors: [
            {
                type: T.ObjectId,
                ref: 'Author',
                required: true,
            }
        ],
        publisher: {
            type: T.ObjectId,
            ref: 'Publisher',
            required: [true, bookMessages.requiredPublisher()]
        },
        addedBy: {
            type: T.ObjectId,
            ref: 'User',
            required: [true, bookMessages.requiredAddedBy()]
        },
        topics: [
            {
                type: T.ObjectId,
                ref: 'Topic',
                required: true,
            }
        ],
        language: {
            type: T.ObjectId,
            ref: 'Language',
            required: [true, bookMessages.requiredLanguage()]
        },
        imageUrl: {
            type: T.String,
            required: [true, bookMessages.requiredImageUrl()],
        },
        price: {
            type: T.Number,
            min: [0, bookMessages.invalidPrice(0)],
            required: [true, bookMessages.requiredPrice()],
        },
        publishedYear: {
            type: T.Number,
            min: [1950, bookMessages.invalidPublishedYear(1950, 2025)],
            max: [2025, bookMessages.invalidPublishedYear(1950, 2025)],
            required: [true, bookMessages.requiredPublishedYear()],
        },
        numbers: {
            type: T.Number,
            min: [0, bookMessages.invalidNumbers(0)],
            required: [true, bookMessages.requiredNumbers()],
        },
        availableNumbers: {
            type: T.Number,
            required: true,
        },
        description: {
            type: T.String,
            default: null,
        },
        averageRating: {
            type: T.Number,
            min: 0,
            max: 5,
            default: 0,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

export const Book = model<IBook>('Book', BookSchema);
