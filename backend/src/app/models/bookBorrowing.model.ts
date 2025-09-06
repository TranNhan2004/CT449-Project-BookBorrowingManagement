import { model, Schema } from "mongoose";
import { IBookBorrowing } from "../types/bookBorrowing";
import { bookBorrowingMessages } from "../messages/vi.message";

const T = Schema.Types;

const BookBorrowingSchema = new Schema<IBookBorrowing>({
    borrowedBy: {
        type: T.ObjectId,
        ref: 'User',
        required: [true, bookBorrowingMessages.requiredBorrowedBy()],
    },
    borrowedBook: {
        type: T.ObjectId,
        ref: 'Book',
        required: [true, bookBorrowingMessages.requiredBorrowedBook()],
    },
    addedBy: {
        type: T.ObjectId,
        ref: 'User',
        required: [true, bookBorrowingMessages.requiredAddedBy()],
    },
    borrowedDate: {
        type: T.Date,
        required: true,
    },
    dueDate: {
        type: T.Date,
        required: true,
    },
    returnedDate: {
        type: T.Date,
        default: null,
    }
});

BookBorrowingSchema.index({ borrowedBy: 1, borrowedBook: 1, borrowedDate: 1 }, { unique: true })

export const BookBorrowing = model<IBookBorrowing>('BookBorrowing', BookBorrowingSchema);
