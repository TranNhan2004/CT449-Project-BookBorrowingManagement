const mongoose = require('mongoose');

const BookItemSchema = mongoose.Schema({
    itemID: {
        type: String,
        unique: true,
        required: true
    },
    bookID: {
        type: String,
        ref: 'Book',
        required: true
    },
    addedBy: {
        type: ObjectId,
        ref: 'Employee',
        required: true,
    },
    canBorrow: {
        type: Boolean,
        default: true,
        required: true
    },
    status: {
        type: String,
        enum: ['Có Sẵn', 'Đã Được Mượn', 'Đã Được Đặt Trước', 'Chỉ Đọc Tại Chỗ', 'Mất'],
        default: 'Có Sẵn',
        required: true
    }
});

const BookItem = mongoose.model('BookItem', BookItemSchema);
module.exports = BookItem;