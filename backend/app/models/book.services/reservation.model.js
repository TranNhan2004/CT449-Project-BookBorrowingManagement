const mongoose = require('mongoose');
const { ObjectId, Date } = mongoose.Schema.Types;

const reservationSchema = new mongoose.Schema({
    reservedBy: {
        type: ObjectId,
        ref: 'Reader',
        required: true
    },
    item: {
        type: ObjectId,
        ref: 'BookItem',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;