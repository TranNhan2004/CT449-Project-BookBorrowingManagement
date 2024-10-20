const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    bookID: {
        type: String,
        unique: true,
        required: true
    },
    authorID: {
        type: ObjectId,
        ref: 'Author',
        required: true
    },
    publisherID: {
        type: ObjectId,
        ref: 'Publisher',
        required: true
    },
    addedBy: {
        type: ObjectId,
        ref: 'Employee',
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: Buffer,
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    publishYear: {
        type: Number,
        min: 1800,
        max: new Date().getFullYear(),
        required: true
    },
    itemNumber: {
        type: Number,
        min: 1,
        required: true
    }
});

const Book = mongoose.model('Book', BookSchema);
module.exports = Book;