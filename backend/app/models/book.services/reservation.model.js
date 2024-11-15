const mongoose = require('mongoose');
const { ObjectId, Date } = mongoose.Schema.Types;
const { db } = require('../../config');
const reservationConfig = db.collections.reservation;

const reservationSchema = new mongoose.Schema({
    reservedBy: {
        type: ObjectId,
        ref: 'Reader',
        required: true
    },
    bookItem: {
        type: ObjectId,
        ref: 'BookItem',
        required: true
    },
    reservedDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = { Reservation, reservationConfig };