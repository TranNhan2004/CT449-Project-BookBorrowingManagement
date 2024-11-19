const { BookItem, bookItemConfig } = require('../../models/book.data/bookItem.model');
const { BookBorrowing } = require('../../models/book.services/bookBorrowing.model');
const { Reservation } = require('../../models/book.services/reservation.model');
const { bookItemMessages,
        bookBorrowingMessages,
        reservationMessages, 
        processMessages } = require('../../messages/vi.message');
const { ApiError } = require('../../utils/error.util');
const { getValidatedId, isDefined } = require('../../utils/validation.util');
const { formatPublicId } = require('../../utils/publicIdFormatter.util');
const BookService = require('./book.service');
const StaffService = require('../book.accounts/staff.service');

const bookService = new BookService();
const staffService = new StaffService();

class BookItemService {
    constructor() {
        this.bookItemModel = BookItem;
        this.bookItemConfig = bookItemConfig;
    }

    async checkRequiredFields(payload) {
        if (!isDefined(payload.book)) {
            throw new ApiError(400, processMessages.required(bookItemMessages.requiredBook));
        }
        
        if (!isDefined(payload.addedBy)) {
            throw new ApiError(400, processMessages.required(bookItemMessages.requiredAddedBy));
        }

        if (!isDefined(payload.status)) {
            throw new ApiError(400, processMessages.required(bookItemMessages.requiredStatus));
        }

        return true;
    }

    async checkStatus(payload) {
        if (!this.bookItemConfig.statusEnum.includes(payload.status)) {
            throw new ApiError(400, bookItemMessages.invalidStatus);
        }
        return true;
    }

    async create(payload) {
        await this.checkRequiredFields(payload);
        await this.checkStatus(payload);
        
        const bookItemData = {
            book: payload.book,
            addedBy: payload.addedBy,
            status: payload.status,
        }

        // Check staff
        const staffAttSelection = { staff: '_id' };
        const [_1, book, _2] = await Promise.all([
            staffService.findById(bookItemData.addedBy, staffAttSelection),
            bookService.incrementPublicItemIdCounter(bookItemData.book),
            bookService.updateItemNumberById(bookItemData.book, 1)
        ]);
        
        bookItemData.publicId = `${book.publicId}.${formatPublicId(book.publicItemIdCounter, 
                                                                    this.bookItemConfig.publicIdSuffixLength)}`;
        
        return await this.bookItemModel.create(bookItemData);
    }

    async findAll(filter = {}, attSelection = {}) {
        return await this.bookItemModel.find(filter).select(attSelection.bookItem);
    }

    async findById(_id, attSelection = {}) {
        const validatedId = getValidatedId(_id);
        const bookItem = await this.bookItemModel.findById(validatedId).select(attSelection.bookItem);
        if (!bookItem) {
            throw new ApiError(404, processMessages.notFound(bookItemMessages.bookItem, { id: _id }));
        }
        return bookItem;
    }

    async updateStatusById(_id, status) {
        if (!isDefined(status)) {
            throw new ApiError(400, bookItemMessages.requiredStatus);
        }
        await this.checkStatus({ status: status });

        const bookItem = await this.findById(_id);
        bookItem.status = status;
        return await bookItem.save();
    }

    async checkRefBeforeDelete(bookItem) {
        const filter = { bookItem: bookItem._id };
        if (await BookBorrowing.exists(filter)) {
            throw new ApiError(400, processMessages.foreignKeyDeletionError(
                bookItemMessages.bookItem,
                bookItem.publicId,
                bookBorrowingMessages.bookBorrowing
            ));
        }

        if (await Reservation.exists(filter)) {
            throw new ApiError(400, processMessages.foreignKeyDeletionError(
                bookItemMessages.bookItem,
                bookItem.publicId,
                reservationMessages.reservation
            ));
        }

        return true;
    }
    
    async deleteById(_id) {
        const attSelection = { bookItem: '_id publicId book', book: '_id' };
        const bookItem = await this.findById(_id, attSelection);

        await this.checkRefBeforeDelete(bookItem);

        const result = await this.bookItemModel.deleteOne({ _id: bookItem._id });
        await bookService.updateItemNumberById(bookItem.book._id, -1);
        return result.deletedCount;
    }

    async deleteAll() {
        const attSelection = { bookItem: '_id publicId book', book: '_id' };
        const bookItems = await this.findAll({}, attSelection);

        await Promise.all(bookItems.map(async (bookItem) => await this.checkRefBeforeDelete(bookItem)));

        const result = await this.bookItemModel.deleteMany({});
        await Promise.all(bookItems.map(async (bookItem) => 
            await bookService.updateItemNumberById(bookItem.book._id, -Infinity)
        ));

        return result.deletedCount;
    }
}

module.exports = BookItemService;