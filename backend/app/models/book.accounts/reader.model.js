const mongoose = require('mongoose');
const { ObjectId, String, Number } = mongoose.Schema.Types;
const { db } = require('../../config');
const readerConfig = db.collections.reader;
const reservationConfig = db.collections.reservation;
const bookBorrowingConfig = db.collections.bookBorrowing;

const readerSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        unique: true,
        required: true,
        index: true,
    },
    points: {
        type: Number,
        min: readerConfig.minPoints,
        default: readerConfig.defaultPoints,
        required: true,
    },
    rank: {
        title: { type: String, required: true },
        minPoints: { type: Number, required: true },
        maxPoints: { type: Number, required: true },
        maxExtensionDays: { type: Number, required: true },
        maxReservationDays: { type: Number, required: true },
    },
    currentReservationQuantity: {
        type: Number,
        min: 0,
        max: reservationConfig.maxReserveBookItems,
        default: 0,
        required: true,
    },
    currentBorrowingQuantity: {
        type: Number,
        min: 0,
        max: bookBorrowingConfig.maxBorrowBookItems,
        default: 0,
        required: true,
    }
});

const Reader = mongoose.model('Reader', readerSchema);
module.exports = { Reader, readerConfig };