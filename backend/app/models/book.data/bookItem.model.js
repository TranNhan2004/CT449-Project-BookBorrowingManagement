const mongoose = require('mongoose');
const { ObjectId, String, Boolean } = mongoose.Schema.Types;
const { db } = require('../../config');
const bookItemConfig = db.collections.bookItem;

const bookItemSchema = new mongoose.Schema({
    publicId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    book: {
        type: ObjectId,
        ref: 'Book',
        required: true
    },
    addedBy: {
        type: ObjectId,
        ref: 'Staff',
        required: true,
    },
    status: {
        type: String,
        enum: bookItemConfig.statusEnum,
        required: true
    }
});

const BookItem = mongoose.model('BookItem', bookItemSchema);
module.exports = { BookItem, bookItemConfig };