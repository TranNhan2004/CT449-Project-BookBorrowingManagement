const mongoose = require('mongoose');
const { ObjectId, String, Date, Number } = mongoose.Schema.Types;

const readerSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    point: {
        type: Number,
        default: 10,
        required: true,
    },
    membership: {
        type: String,
        enum: ['basic', 'bronze', 'silver', 'gold', 'platinum', 'diamond'],
        required: true,
    },
    maxBookBorrowingQuantity: {
        type: Number,
        default: 5,
        required: true,
    } 
});

const Reader = mongoose.model('Reader', readerSchema);
module.exports = Reader;