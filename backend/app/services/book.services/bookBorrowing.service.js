const { BookBorrowing, bookBorrowingConfig } = require('../../models/book.services/bookBorrowing.model');
const { bookBorrowingMessages, processMessages } = require('../../messages/vi.message');
const { ApiError } = require('../../utils/error.util');
const { getValidatedId, isDefined } = require('../../utils/validationData.util');

const ReaderService = require('../book.accounts/reader.service');
const BookItemService = require('../book.data/bookItem.service');
const StaffService = require('../book.accounts/staff.service');
const ReservationService = require('../book.services/reservation.service');

const readerService = new ReaderService();
const bookItemService = new BookItemService();
const staffService = new StaffService();
const reservationService = new ReservationService();

class BookBorrowingService {

    constructor() {
        this.bookBorrowingModel = BookBorrowing;
        this.bookBorrowingConfig = bookBorrowingConfig;
    }

    async create(payload) {
        if (!isDefined(payload.borrowedBy)) {
            throw new ApiError(400, bookBorrowingMessages.requiredBorrowedBy);
        }
        if (!isDefined(payload.bookItem)) {
            throw new ApiError(400, bookBorrowingMessages.requiredBookItem);
        }
        if (!isDefined(payload.addedBy)) {
            throw new ApiError(400, bookBorrowingMessages.requiredAddedBy);
        }

        const readerAttSelection = { reader: '_id rank' };      
        const bookItemAttSelection = { bookItem: '_id status' };
        const staffAttSelection = { staff: '_id' };
        const [reader, bookItem, ] = await Promise.all([
            readerService.findById(payload.borrowedBy, readerAttSelection),
            bookItemService.findById(payload.bookItem, bookItemAttSelection),
            staffService.findById(payload.addedBy, staffAttSelection)
        ]);

        console.log(bookItem);
        
        const bookItemStatusEnum = bookItemService.bookItemConfig.statusEnum;
        if (bookItem.status !== bookItemStatusEnum[0] && bookItem.status !== bookItemStatusEnum[1]) {
            throw new ApiError(400, bookBorrowingMessages.canNotBorrow);
        }

        const maxQuantity = this.bookBorrowingConfig.maxBorrowBookItems;
        if (reader.currentBorrowingQuantity >= maxQuantity) {
            throw new ApiError(400, processMessages.maxBorrowedBooks);
        }

        const currentDate = new Date();
        if (bookItem.status === bookItemStatusEnum[1]) {
            const reservationFilter = { 
                reservedBy: getValidatedId(payload.borrowedBy),
                bookItem: getValidatedId(payload.bookItem)
            }
            const reservationAttSelection = { reservation: '_id dueDate' };
            const reservation = await reservationService.findOne(reservationFilter, reservationAttSelection, false);
            
            if (!reservation) {
                throw new ApiError(400, bookBorrowingMessages.canNotBorrow);
            }

            await reservationService.deleteById(reservation._id);
            if (currentDate <= reservation.dueDate) {
                await readerService.updatePointsById(reader._id, reservationService.reservationConfig.reward);
            }
        }

        const dueDate = new Date(currentDate); 
        dueDate.setDate(currentDate.getDate() + bookBorrowingConfig.standardBorrowDays);
        const bookBorrowingData = {
            borrowedBy: payload.borrowedBy,
            bookItem: payload.bookItem,
            addedBy: payload.addedBy,
            borrowedDate: currentDate,
            dueDate: dueDate
        };

        const bookBorrowing = await this.bookBorrowingModel.create(bookBorrowingData);
        await readerService.updateCurrentBorrowingQuantityById(reader._id, 1);
        await bookItemService.updateStatusById(bookItem._id, bookItemStatusEnum[2]);
        return bookBorrowing;
    }

    async extractFKSelections(attSelection = {}) {
        let fkSelections = [];
        if (attSelection.borrowedBy) {
            fkSelections.push({ path: 'borrowedBy', select: attSelection.borrowedBy });
        }
        if (attSelection.bookItem) {
            fkSelections.push({ path: 'bookItem', select: attSelection.bookItem });
        }
        if (attSelection.addedBy) {
            fkSelections.push({ path: 'addedBy', select: attSelection.addedBy });
        }

        return fkSelections;
    }

    async findAll(filter = {}, attSelection = {}) {
        const fkSelections = await this.extractFKSelections(attSelection);
        return await this.bookBorrowingModel.find(filter).select(attSelection.bookBorrowing || '')
                                                        .populate(fkSelections);
    }

    async findById(_id, attSelection = {}) {
        const validatedId = getValidatedId(_id);
        const bookBorrowing = await this.bookBorrowingModel.findById(validatedId)
                                                            .select(attSelection.bookBorrowing || '');
        if (!bookBorrowing) {
            throw new ApiError(404, processMessages.notFound(bookBorrowingMessages.bookBorrowing, { id: _id }));
        }
        const fkSelections = await this.extractFKSelections(attSelection);
        return await bookBorrowing.populate(fkSelections);
    }

    async returnBookItemById(_id) {
        const bookBorrowing = await this.findById(_id);
    
        if (isDefined(bookBorrowing.returnedDate)) {
            throw new ApiError(400, bookBorrowingMessages.returned);
        }

        await readerService.updateCurrentBorrowingQuantityById(bookBorrowing.borrowedBy, -1);
    
        const bookItemStatusEnum = bookItemService.bookItemConfig.statusEnum;
        await bookItemService.updateStatusById(bookBorrowing.bookItem, bookItemStatusEnum[0]);
        
        bookBorrowing.returnedDate = new Date();
        if (bookBorrowing.returnedDate <= bookBorrowing.dueDate) {
            await readerService.updatePointsById(bookBorrowing.borrowedBy, this.bookBorrowingConfig.reward);
        }
    
        return await bookBorrowing.save();
    }
    
    async extendDueDateById(_id) {
        const attSelection = { borrowedBy: '_id rank' };
        const bookBorrowing = await this.findById(_id, attSelection);
    
        const extendedDueDate = new Date(bookBorrowing.dueDate);
        extendedDueDate.setDate(extendedDueDate.getDate() + bookBorrowing.borrowedBy.rank.maxExtensionDays);
        bookBorrowing.dueDate = extendedDueDate;
    
        return await bookBorrowing.save();
    }
    
    async checkDueDate(borrowedBy) {
        const currentDate = new Date();
        const filter = { borrowedBy: borrowedBy, dueDate: { $lt: currentDate } };
        const attSelection = { bookBorrowing: '_id borrowedBy bookItem dueDate' };
        const dueDateBorrowings = await this.findAll(filter, attSelection);
    
        if (dueDateBorrowings.length === 0) {
            return true;
        }
    
        const totalPenalty = this.bookBorrowingConfig.penalty * dueDateBorrowings.length;
        await readerService.updatePointsById(borrowedBy, -totalPenalty); 
    
        return true;
    }

    async deleteById(_id) {
        const attSelection = { bookBorrowing: '_id borrowedBy bookItem', borrowedBy: '_id', bookItem: '_id' };
        const bookBorrowing = await this.findById(_id, attSelection);
        const result = await this.bookBorrowingModel.deleteOne({ _id: bookBorrowing._id });

        await readerService.updateCurrentBorrowingQuantityById(bookBorrowing.borrowedBy._id, -1);
        await bookItemService.updateStatusById(bookBorrowing.bookItem._id, 
                                                bookItemService.bookItemConfig.statusEnum[0]);
        return result.deletedCount;
    }

    async deleteAll() {
        const attSelection = { bookBorrowing: '_id borrowedBy bookItem', borrowedBy: '_id', bookItem: '_id' };
        const bookBorrowings = await this.findAll({}, attSelection);
        
        const result = await this.bookBorrowingModel.deleteMany({});
        await Promise.all(bookBorrowings.map(async (bookBorrowing) => {
            await readerService.updateCurrentBorrowingQuantityById(bookBorrowing.borrowedBy._id, -Infinity);
            await bookItemService.updateStatusById(bookBorrowing.bookItem._id, 
                                                    bookItemService.bookItemConfig.statusEnum[0]);
        }));
        
        return result.deletedCount;
    }
}

module.exports = BookBorrowingService;