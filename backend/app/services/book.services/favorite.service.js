const { Favorite } = require('../../models/book.services/favorite.model');
const { favoriteMessages, processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');
const { getValidatedId, isDefined } = require('../../utils/validation.util');

const ReaderService = require('../book.accounts/reader.service');
const BookService = require('../book.data/book.service');

const readerService = new ReaderService();
const bookService = new BookService();

class FavoriteService {

    constructor() {
        this.favoriteModel = Favorite;
    }

    async create(payload) {
        if (!isDefined(payload.reader)) {
            throw new APIError(400, favoriteMessages.requiredReader);
        }

        if (!isDefined(payload.book)) {
            throw new APIError(400, favoriteMessages.requiredBook);
        }

        const readerAttSelection = { reader: '_id' };
        const bookAttSelection = { book: '_id' };
        await Promise.all([
            readerService.findById(payload.reader, readerAttSelection),
            bookService.findById(payload.book, bookAttSelection)
        ]);

        const favoriteData = {
            reader: payload.reader,
            book: payload.book
        };

        return await this.favoriteModel.create(favoriteData);
    }

    async extractFKSelections(attSelection) {
        let fkSelections = [];
        if (attSelection.reader) {
            fkSelections.push({ path: 'reader', select: attSelection.reader });
        }
        if (attSelection.book) {
            fkSelections.push({ path: 'book', select: attSelection.book });
        }
        return fkSelections;
    }

    async findAll(filter = {}, attSelection = {}) {
        const fkSelections = await this.extractFKSelections(attSelection);
        return await this.favoriteModel.find(filter).select(attSelection.favorite || '').populate(fkSelections);
    }

    async findById(_id, attSelection = {}) {
        const validatedId = getValidatedId(_id);
        const favorite = await this.favoriteModel.findById(validatedId).select(attSelection.favorite || '');
        if (!favorite) {
            throw new APIError(404, processMessages.notFound(favoriteMessages.favorite, { id: _id }));
        }
        const fkSelections = await this.extractFKSelections(attSelection);
        return await favorite.populate(fkSelections);
    }

    async deleteById(_id) {
        const attSelection = { favorite: '_id' };
        const favorite = await this.findById(_id, attSelection);
        const result = await this.favoriteModel.deleteOne({ _id: favorite._id });
        return result.deletedCount;
    }

    async deleteAll() {
        const result = await this.favoriteModel.deleteMany({});
        return result.deletedCount;
    }   
}

module.exports = FavoriteService;