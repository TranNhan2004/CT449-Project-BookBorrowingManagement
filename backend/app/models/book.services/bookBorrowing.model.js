const mongoose = require('mongoose');

const BookBorrowingSchema = mongoose.Schema({
    borrowedBy: {
        type: ObjectId,
        ref: 'Reader',
        required: true
    },
    itemID: {
        type: String,
        ref: 'BookItem',
        required: true
    },
    borrowedDate: {
        type: Date,
        default: Date.now(),
        required: true
    },
    approvedBy: {
        type: ObjectId,
        ref: 'Employee',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnedDate: {
        type: Date,
        default: null,
    },
});

const BookBorrowing = mongoose.model('BookBorrowing', BookBorrowingSchema);
module.exports = BookBorrowing;