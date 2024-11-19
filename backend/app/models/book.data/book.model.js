const mongoose = require('mongoose');
const { ObjectId, String, Number, Buffer } = mongoose.Schema.Types;
const { db } = require('../../config');
const bookConfig = db.collections.book;

const bookSchema = new mongoose.Schema({
    publicId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    authors: [
        {
            type: ObjectId,
            ref: 'Author',
            required: true,
        }
    ],
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
    topics: [
        {
            type: ObjectId, 
            ref: 'Topic', 
            required: true,
        }
    ],
    title: {
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
        min: bookConfig.minPrice,
        required: true
    },
    publishedYear: {
        type: Number,
        min: bookConfig.getMinPublishedYear(),
        max: bookConfig.getMaxPublishedYear(),
        required: true
    },    
    publicItemIdCounter: {
        type: Number,
        min: 0,
        default: 0,
        required: true
    },
    itemNumber: {
        type: Number,
        min: 0,
        default: 0,
        required: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    averageRating: { 
        type: Number, 
        min: 0, 
        max: 5, 
        default: 0,
        required: true,
    }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = { Book, bookConfig };