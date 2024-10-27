const mongoose = require('mongoose');
const { ObjectId, String, Number, Decimal128, Buffer } = mongoose.Schema.Types;


const BookSchema = new mongoose.Schema({
    bookId: {
        type: String,
        unique: true,
        required: true
    },
    author: {
        type: ObjectId,
        ref: 'Author',
        required: true
    },
    publisher: {
        type: ObjectId,
        ref: 'Publisher',
        required: true
    },
    addedBy: {
        type: ObjectId,
        ref: 'Staff',
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
        type: Decimal128,
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
    },
    topics: [{type: String, ref: 'Topic', required: true}]
});

const Book = mongoose.model('Book', BookSchema);
module.exports = Book;