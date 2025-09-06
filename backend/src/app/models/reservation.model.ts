import { model, Schema } from "mongoose";
import { reservationMessages } from "../messages/vi.message";
import { IReservation } from "../types/reservation";

const T = Schema.Types;

const ReservationSchema = new Schema<IReservation>({
    reservedBy: {
        type: T.ObjectId,
        ref: 'User',
        required: [true, reservationMessages.requiredReservedBy()],
    },
    reservedBook: {
        type: T.ObjectId,
        ref: 'Book',
        required: [true, reservationMessages.requiredReservedBook()]
    },
    reservedDate: {
        type: T.Date,
        required: true
    },
    dueDate: {
        type: T.Date,
        required: true
    }
});

ReservationSchema.index({ reservedBy: 1, reservedBook: 1, reservedDate: 1 }, { unique: true })

export const Reservation = model<IReservation>('Reservation', ReservationSchema);

