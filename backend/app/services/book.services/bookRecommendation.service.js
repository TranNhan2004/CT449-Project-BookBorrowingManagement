const { BookRecommendation, bookRecommendationConfig } = require('../../models/book.services/bookRecommendation.model');
const { bookRecommendationMessages, processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');
const { getValidatedId, isDefined } = require('../../utils/validation.util');

const ReaderService = require('../book.accounts/reader.service');
const StaffService = require('../book.accounts/staff.service');

const readerService = new ReaderService();
const staffService = new StaffService();

class BookRecommendationService {
    constructor() {
        this.bookRecommendationModel = BookRecommendation;
        this.bookRecommendationConfig = bookRecommendationConfig;
    }

    async extractBookRecommendationData(payload) {
        const bookRecommendationData = {
            recommendedBy: payload.recommendedBy,
            bookTitle: payload.bookTitle,
            authorsName: payload.authorsName,
            publishedYear:payload.publishedYear,
            bookCoverImage: payload.bookCoverImage,
            description: payload.description        
        }

        // Get fields with not undefined values
        Object.keys(bookRecommendationData).forEach(
            (key) => !isDefined(bookRecommendationData[key]) && delete bookRecommendationData[key]
        );
        
        return bookRecommendationData;
    }

    async checkRequiredFields(payload) {
        if (!isDefined(payload.recommendedBy)) {
            throw new APIError(400, bookRecommendationMessages.requiredRecommendedBy);
        }
        
        if (!isDefined(payload.bookTitle)) {
            throw new APIError(400, bookRecommendationMessages.requiredBookTitle);
        }

        if (!isDefined(payload.authorsName) || payload.authorsName.length === 0) {
            throw new APIError(400, bookRecommendationMessages.requiredAuthorsName);
        }

        if (!isDefined(payload.publishedYear)) {
            throw new APIError(400, bookRecommendationMessages.requiredPublishedYear);
        }

        if (!isDefined(payload.bookCoverImage)) {
            throw new APIError(400, bookRecommendationMessages.requiredBookCoverImage);
        }

        if (!isDefined(payload.description)) {
            throw new APIError(400, bookRecommendationMessages.requiredDescription);
        }

        return true;
    }

    async create(payload) {
        await this.checkRequiredFields(payload);

        const minYear = this.bookRecommendationConfig.getMinPublishedYear();
        const maxYear = this.bookRecommendationConfig.getMaxPublishedYear();
        if (payload.publishedYear < minYear || payload.publishedYear > maxYear) {
            throw new APIError(400, bookRecommendationMessages.invalidPublishedYear(minYear, maxYear));
        }

        const lowerAuthorsName = payload.authorsName.map(authorName => authorName.toLowerCase().replace(/\s+/g, ''));
        const authorsNameSet = new Set(lowerAuthorsName)
        if (authorsNameSet.size !== lowerAuthorsName.length) {
            throw new APIError(400, bookRecommendationMessages.existedAuthorName);
        }

        const readerAttSelection = { reader: '_id' };
        await readerService.findById(payload.recommendedBy, readerAttSelection);

        const bookRecommendationData = await this.extractBookRecommendationData(payload);
        return await this.bookRecommendationModel.create(bookRecommendationData);
    }

    async extractFKSelections(attSelection) {
        let fkSelections = [];
        if (attSelection.recommendedBy) {
            fkSelections.push({ path: 'recommendedBy', select: attSelection.recommendedBy });
        }
        if (attSelection.approvedBy) {
            fkSelections.push({ path: 'approvedBy', select: attSelection.approvedBy });
        }

        return fkSelections;
    }

    async findAll(filter = {}, attSelection = {}) {
        return await this.bookRecommendationModel.find(filter).select(attSelection.bookRecommendation || '');
    }

    async findById(_id, attSelection = {}) {
        const validatedId = getValidatedId(_id);
        const bookRecommendation = await this.bookRecommendationModel.findById(validatedId)
                                                                .select(attSelection.bookRecommendation || '');
        if (!bookRecommendation) {
            throw new APIError(404, processMessages.notFound(bookRecommendationMessages.bookRecommendation, { id: _id }));
        }
        const fkSelections = await this.extractFKSelections(attSelection);
        return await bookRecommendation.populate(fkSelections);
    }

    async updateStatusById(_id, approvedBy, status) {
        if (!isDefined(approvedBy)) {
            throw new APIError(400, bookRecommendationMessages.requiredApprovedBy);
        }
        if (!isDefined(status)) {
            throw new APIError(400, bookRecommendationMessages.requiredStatus);
        }
    
        const statusEnum = this.bookRecommendationConfig.statusEnum;
        if (!statusEnum.includes(status)) {
            throw new APIError(400, bookRecommendationMessages.invalidStatus);
        }
    
        const attSelection = { bookRecommendation: '_id status' };
        const bookRecommendation = await this.findById(_id, attSelection);
    
        if (bookRecommendation.status !== statusEnum[0]) {
            throw new APIError(400, bookRecommendationMessages.canNotChangeStatus);
        }
    
        await staffService.findById(approvedBy);
    
        bookRecommendation.status = status;
        bookRecommendation.approvedBy = approvedBy;
    
        await bookRecommendation.save();
        return bookRecommendation;  
    }
    
    async deleteById(_id) {
        const attSelection = { bookRecommendation: '_id' };
        const bookRecommendation = await this.findById(_id, attSelection);
        const result = await this.bookRecommendationModel.deleteOne({ _id: bookRecommendation._id });
        return result.deletedCount;
    }

    async deleteAll() {
        const result = await this.bookRecommendationModel.deleteMany({});
        return result.deletedCount;
    }

}

module.exports = BookRecommendationService;