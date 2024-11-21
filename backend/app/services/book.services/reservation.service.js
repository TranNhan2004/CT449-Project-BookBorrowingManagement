const { Reservation, reservationConfig } = require('../../models/book.services/reservation.model');
const { reservationMessages, processMessages } = require('../../messages/vi.message');
const { ApiError } = require('../../utils/error.util');
const { getValidatedId, isDefined } = require('../../utils/validationData.util');

const ReaderService = require('../book.accounts/reader.service');
const BookItemService = require('../book.data/bookItem.service');

const readerService = new ReaderService();
const bookItemService = new BookItemService();

class ReservationService {

    constructor() {
        this.reservationModel = Reservation;
        this.reservationConfig = reservationConfig;
    }

    async create(payload) {
        if (!isDefined(payload.reservedBy)) {
            throw new ApiError(400, reservationMessages.requiredReservedBy);
        }
        if (!isDefined(payload.bookItem)) {
            throw new ApiError(400, reservationMessages.requiredBookItem);
        }

        const readerAttSelection = { reader: '_id rank currentReservationQuantity' };
        const bookItemAttSelection = { bookItem: '_id status' };

        const [reader, bookItem] = await Promise.all([
            readerService.findById(payload.reservedBy, readerAttSelection),
            bookItemService.findById(payload.bookItem, bookItemAttSelection)
        ]);
        
        const bookItemStatusEnum = bookItemService.bookItemConfig.statusEnum;
        if (bookItem.status !== bookItemStatusEnum[0]) {
            throw new ApiError(400, reservationMessages.canNotReserve);
        }

        const maxQuantity = this.reservationConfig.maxReserveBookItems;
        if (reader.currentReservationQuantity === maxQuantity) {
            throw new ApiError(400, reservationMessages.maxReserveBookItems(maxQuantity));
        }

        const reservedDate = new Date(); 
        const dueDate = new Date(reservedDate); 
        dueDate.setDate(reservedDate.getDate() + reader.rank.maxReservationDays);
        const reservationData = {
            reservedBy: payload.reservedBy,
            bookItem: payload.bookItem,
            reservedDate: reservedDate,
            dueDate: dueDate
        };

        const reservation = await this.reservationModel.create(reservationData);
        await readerService.updateCurrentReservationQuantityById(reader._id, 1);
        await bookItemService.updateStatusById(bookItem._id, bookItemStatusEnum[1]);
        return reservation;
    }

    async extractFKSelections(attSelection = {}) {
        let fkSelections = [];
        if (attSelection.reservedBy) {
            fkSelections.push({ path: 'reservedBy', select: attSelection.reservedBy });
        }
        if (attSelection.bookItem) {
            fkSelections.push({ path: 'bookItem', select: attSelection.bookItem });
        }

        return fkSelections;
    }

    async findAll(filter = {}, attSelection = {}) {
        const fkSelections = await this.extractFKSelections(attSelection);
        return await this.reservationModel.find(filter).select(attSelection.reservation || '').populate(fkSelections);
    }

    async findOne(filter = {}, attSelection = {}, throwError = true) {
        const reservation = await this.reservationModel.findOne(filter).select(attSelection.reservation || '');
        if (!reservation && throwError) {
            throw new ApiError(404, processMessages.notFound(reservationMessages.reservation, filter));
        }
        const fkSelections = await this.extractFKSelections(attSelection);
        return await reservation.populate(fkSelections);
    }

    async findById(_id, attSelection = {}) {
        const validatedId = getValidatedId(_id);
        const reservation = await this.reservationModel.findById(validatedId).select(attSelection.reservation || '');
        if (!reservation) {
            throw new ApiError(404, processMessages.notFound(reservationMessages.reservation, { id: _id }));
        }
        const fkSelections = await this.extractFKSelections(attSelection);
        return await reservation.populate(fkSelections);
    }

    async checkDueDate(reservedBy) {
        const currentDate = new Date();
        const filter = { reservedBy: reservedBy, dueDate: { $lt: currentDate } };
        const attSelection = { reservation: '_id reservedBy bookItem dueDate' };
        const dueDateReservations = await this.findAll(filter, attSelection);
    
        if (dueDateReservations.length === 0) {
            return true;
        }
    
        const totalPenalty = this.reservationConfig.penalty * dueDateReservations.length;
        await readerService.updatePointsById(reservedBy, -totalPenalty); 
    
        const readerAttSelection = { reader: '-_id user', user: '-_id isValid'};
        const reader = await readerService.findById(reservedBy, readerAttSelection);

        if (!reader.user.isValid) {
            await Promise.all(dueDateReservations.map(async (reservation) => 
                bookItemService.updateStatusById(reservation.bookItem._id, 
                                                    bookItemService.bookItemConfig.statusEnum[0])
            ));
        }
    
        return true;
    }
    
    async deleteById(_id) {
        const attSelection = { reservation: '_id reservedBy bookItem', reservedBy: '_id', bookItem: '_id' };
        const reservation = await this.findById(_id, attSelection);
        const result = await this.reservationModel.deleteOne({ _id: reservation._id });

        await readerService.updateCurrentReservationQuantityById(reservation.reservedBy._id, -1);
        await bookItemService.updateStatusById(reservation.bookItem._id, 
                                                bookItemService.bookItemConfig.statusEnum[0]);
        return result.deletedCount;
    }

    async deleteAll() {
        const attSelection = { reservation: '_id reservedBy bookItem', reservedBy: '_id', bookItem: '_id' };
        const reservations = await this.findAll({}, attSelection);

        const result = await this.reservationModel.deleteMany({});
        await Promise.all(reservations.map(async (reservation) => {
            await readerService.updateCurrentReservationQuantityById(reservation.reservedBy._id, -Infinity);
            await bookItemService.updateStatusById(reservation.bookItem._id, 
                                                    bookItemService.bookItemConfig.statusEnum[0]);
        }));

        return result.deletedCount;
    }
}

module.exports = ReservationService;