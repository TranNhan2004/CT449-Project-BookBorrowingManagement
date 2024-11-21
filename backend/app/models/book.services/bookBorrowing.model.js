const mongoose = require('mongoose');
const { ObjectId, Date } = mongoose.Schema.Types;
const { db } = require('../../config');
const bookBorrowingConfig = db.collections.bookBorrowing;

const bookBorrowingSchema = new mongoose.Schema({
    borrowedBy: {
        type: ObjectId,
        ref: 'Reader',
        required: true
    },
    bookItem: {
        type: ObjectId,
        ref: 'BookItem',
        required: true
    },
    addedBy: {
        type: ObjectId,
        ref: 'Staff',
        required: true
    },
    borrowedDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnedDate: {
        type: Date,
        default: null,
    }
});

const BookBorrowing = mongoose.model('BookBorrowing', bookBorrowingSchema);
module.exports = { BookBorrowing, bookBorrowingConfig };