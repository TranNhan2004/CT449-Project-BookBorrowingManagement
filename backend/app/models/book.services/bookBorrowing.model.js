const mongoose = require('mongoose');
const { ObjectId, Date } = mongoose.Schema.Types;

const BookBorrowingSchema = new mongoose.Schema({
    borrowedBy: {
        type: ObjectId,
        ref: 'Reader',
        required: true
    },
    item: {
        type: ObjectId,
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
        ref: 'Staff',
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