import { model, Schema } from "mongoose";
import { IReview } from "../types/review";
import { RatingEnum } from "../enum/index";
import { reviewMessages } from "../messages/vi.message";

const T = Schema.Types;

const ReviewSchema = new Schema<IReview>(
    {
        reader: {
            type: T.ObjectId,
            ref: 'User',
            required: [true, reviewMessages.requiredReader()]
        },
        book: {
            type: T.ObjectId,
            ref: 'Book',
            required: [true, reviewMessages.requiredBook()]
        },
        rating: {
            type: T.Number,
            enum: Object.values(RatingEnum).filter(v => typeof v === "number"),
            required: [true, reviewMessages.requiredRating()],
            validate: {
                validator: (val: number) => Object.values(RatingEnum).includes(val),
                message: reviewMessages.invalidRating()
            }
        },
        comment: {
            type: T.String,
            required: [true, reviewMessages.requiredComment()],
        },
    },
    {
        timestamps: true,
    }
);

export const Review = model<IReview>('Review', ReviewSchema);
