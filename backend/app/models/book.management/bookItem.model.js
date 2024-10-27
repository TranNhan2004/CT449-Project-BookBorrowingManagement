const mongoose = require('mongoose');
const { ObjectId, String, Boolean } = mongoose.Schema.Types;

const bookItemSchema = new mongoose.Schema({
    itemId: {
        type: String,
        unique: true,
        required: true
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
    canBorrow: {
        type: Boolean,
        default: true,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'can-reserve', 'reserved', 'borrowed', 'lost'],
        default: 'available',
        required: true
    }
});

const BookItem = mongoose.model('BookItem', bookItemSchema);
module.exports = BookItem;