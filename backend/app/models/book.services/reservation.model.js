const mongoose = require('mongoose');

const ReservationSchema = mongoose.Schema({
    reservedBy: {
        type: ObjectId,
        ref: 'Reader',
        required: true
    },
    itemID: {
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

const Reservation = mongoose.model('Reservation', ReservationSchema);
module.exports = Reservation;