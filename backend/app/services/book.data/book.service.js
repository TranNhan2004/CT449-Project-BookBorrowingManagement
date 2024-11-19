const { Book, bookConfig } = require('../../models/book.data/book.model');
const { BookItem } = require('../../models/book.data/bookItem.model');
const { Favorite } = require('../../models/book.services/favorite.model');
const { Review } = require('../../models/book.services/review.model');
const { bookMessages, 
        bookItemMessages,
        favoriteMessages, 
        reviewMessages, 
        processMessages } = require('../../messages/vi.message');
const { ApiError } = require('../../utils/error.util');
const { getValidatedId, isDefined } = require('../../utils/validation.util');
const { formatPublicId } = require('../../utils/publicIdFormatter.util');

const AuthorService = require('./author.service');
const PublisherService = require('./publisher.service');
const StaffService = require('../book.accounts/staff.service');
const TopicService = require('./topic.service');

const authorService = new AuthorService();
const publisherService = new PublisherService();
const staffService = new StaffService();
const topicService = new TopicService();

class BookService {

    constructor() {
        this.bookModel = Book;
        this.bookConfig = bookConfig;
    }

    async extractBookData(payload) {
        const bookData = {
            authors: payload.authors,
            publisher: payload.publisher,
            addedBy: payload.addedBy,
            topics: payload.topics,
            title: payload.title,
            image: payload.image,
            price: payload.price,
            publishedYear: payload.publishedYear,
            description: payload.description
        };

        // Get fields with not undefined values
        Object.keys(bookData).forEach(
            (key) => bookData[key] === undefined && delete bookData[key]
        );
        
        return bookData;
    }

    async checkRequiredFields(payload) {
        if (!isDefined(payload.authors) || payload.authors.length === 0) {
            throw new ApiError(400, bookMessages.requiredAuthors);

        } else if (!isDefined(payload.publisher)) {
            throw new ApiError(400, bookMessages.requiredPublisher);
        
        } else if (!isDefined(payload.addedBy)) {
            throw new ApiError(400, bookMessages.requiredAddedBy);
        
        } else if (!isDefined(payload.title)) {
            throw new ApiError(400, bookMessages.requiredTitle);
        
        } else if (!isDefined(payload.image)) {
            throw new ApiError(400, bookMessages.requiredImage);
        
        } else if (!isDefined(payload.price)) {
            throw new ApiError(400, bookMessages.requiredPrice);
        
        } else if (!isDefined(payload.publishedYear)) {
            throw new ApiError(400, bookMessages.requiredPublishedYear);    
        
        } else if (!isDefined(payload.topics) || payload.topics.length === 0) {
            throw new ApiError(400, bookMessages.requiredTopics);
        }

        return true;

    }

    async checkTopicsMaxLength(payload) {
        const maxLength = this.bookConfig.topicsMaxLength;
        if (payload.topics.length > maxLength) {
            throw new ApiError(400, bookMessages.topicsMaxLength(maxLength));
        }
        return true;
    }

    async checkPublishedYear(payload) {
        const minYear = this.bookConfig.getMinPublishedYear();
        const maxYear = this.bookConfig.getMaxPublishedYear();
        if (payload.publishedYear < minYear || payload.publishedYear > maxYear) {
            throw new ApiError(400, bookMessages.invalidPublishedYear(minYear, maxYear));
        }
        return true;
    }

    async checkPrice(payload) {
        const minPrice = this.bookConfig.minPrice;
        if (payload.price < minPrice) {
            throw new ApiError(400, bookMessages.invalidPrice(minPrice));
        }
        return true;
    }

    async create(payload) {
        await this.checkRequiredFields(payload);
    
        await this.checkTopicsMaxLength(payload);
        await this.checkPublishedYear(payload);
        await this.checkPrice(payload);
    
        const authorAttSelection = { author: '_id' };
        const publisherAttSelection = { publisher: '_id' };
        const staffAttSelection = { staff: '_id' };
        const topicAttSelection = { topic: '_id' };
    
        const authorChecks = payload.authors.map(authorId => authorService.findById(authorId, authorAttSelection));
        const topicChecks = payload.topics.map(topicId => topicService.findById(topicId, topicAttSelection));
    
        await Promise.all([
            Promise.all(authorChecks), 
            Promise.all(topicChecks), 
            publisherService.findById(payload.publisher, publisherAttSelection), 
            staffService.findById(payload.addedBy, staffAttSelection), 
        ]);
    

        const authorSet = new Set(payload.authors);
        if (authorSet.size !== payload.authors.length) {
            throw new ApiError(409, bookMessages.existedAuthor);
        }
    
        const topicSet = new Set(payload.topics);
        if (topicSet.size !== payload.topics.length) {
            throw new ApiError(409, bookMessages.existedTopic);
        }
    
        const bookData = await this.extractBookData(payload);
    
        const mainTopic = await topicService.incrementPublicBookIdCounter(bookData.topics[0]);
        bookData.publicId = `${mainTopic.publicId}.${formatPublicId(
            mainTopic.publicBookIdCounter,
            this.bookConfig.publicIdSuffixLength
        )}`;
    
        return await this.bookModel.create(bookData);
    }
    
    async extractFKSelections(attSelection) {
        let fkSelections = [];
        if (attSelection.authors) {
            fkSelections.push({ path: 'authors', select: attSelection.authors });
        }
        if (attSelection.publisher) {
            fkSelections.push({ path: 'publisher', select: attSelection.publisher });
        }
        if (attSelection.addedBy) {
            fkSelections.push({ path: 'addedBy', select: attSelection.addedBy });
        }
        if (attSelection.topics) {
            fkSelections.push({ path: 'topics', select: attSelection.topics });
        }
        return fkSelections;
    }

    async findAll(filter = {}, attSelection = {}) {
        const fkSelections = await this.extractFKSelections(attSelection);
        return await this.bookModel.find(filter).select(attSelection.book || '').populate(fkSelections);
    }

    async findById(_id, attSelection = {}) {
        const validatedId = getValidatedId(_id);
        const book = await this.bookModel.findById(validatedId).select(attSelection.book || '');
        if (!book) {
            throw new ApiError(404, processMessages.notFound(bookMessages.book, { id: _id }));
        }

        const fkSelections = await this.extractFKSelections(attSelection);
        return await book.populate(fkSelections);
    }

    async updateBasicInfoById(_id, payload) {
        delete payload.addedBy;
    
        if (isDefined(payload.language)) {
            await this.checkLanguage(payload);
        }
    
        if (isDefined(payload.publishedYear)) {
            await this.checkPublishedYear(payload);
        }
    
        if (isDefined(payload.price)) {
            await this.checkPrice(payload);
        }        
    
        if (isDefined(payload.authors)) {
            const authorAttSelection = { author: '_id' };
            const authorChecks = payload.authors.map(authorId => authorService.findById(authorId, authorAttSelection));
            await Promise.all(authorChecks);

            const authorSet = new Set(payload.authors);
            if (authorSet.size !== payload.authors.length) {
                throw new ApiError(409, bookMessages.existedAuthor);
            }
        }

        if (isDefined(payload.topics)) {
            const topicAttSelection = { topic: '_id' };
            const topicChecks = payload.topics.map(topicId => topicService.findById(topicId, topicAttSelection));
            await Promise.all(topicChecks);

            const topicSet = new Set(payload.topics);
            if (topicSet.size !== payload.topics.length) {
                throw new ApiError(409, bookMessages.existedTopic);
            }
        }

        if (isDefined(payload.publisher)) {
            const publisherAttSelection = { publisher: '_id' };
            await publisherService.findById(payload.publisher, publisherAttSelection);
        }
        
        const updatedData = await this.extractBookData(payload);
        const book = await this.findById(_id);

        if (book.topics[0] != updatedData.topics[0]) {
            throw new ApiError(400, bookMessages.canNotChangeMainTopic);
        }
    
        Object.assign(book, updatedData);
        return await book.save();
    }
    
    async updateItemNumberById(_id, increment) {
        const book = await this.findById(_id);

        book.itemNumber = Math.max(book.itemNumber + increment, 0);
        console.log(book);
        return await book.save();
    }
    
    async incrementPublicItemIdCounter(_id) {
        const book = await this.findById(_id);

        book.publicItemIdCounter += 1;
        return await book.save();
    }
    
    async updateAverageRatingById(_id, averageRating) {
        const book = await this.findById(_id);
        
        book.averageRating = averageRating;
        return await book.save();
    }
    
    async checkRefBeforeDelete(book) {
        const filter = { book: book._id };
        if (await BookItem.exists(filter)) {
            throw new ApiError(400, processMessages.foreignKeyDeletionError(
                bookMessages.book,
                book.title,
                bookItemMessages.bookItem
            ));
        }

        if (await Favorite.exists(filter)) {
            throw new ApiError(400, processMessages.foreignKeyDeletionError(
                bookMessages.book,
                book.title,
                favoriteMessages.favorite
            ));
        }

        if (await Review.exists(filter)) {
            throw new ApiError(400, processMessages.foreignKeyDeletionError(
                bookMessages.book,
                book.title,
                reviewMessages.review
            ));
        }

        return true;
    }

    async deleteById(_id) {
        const attSelection = { book: '_id title' };
        const book = await this.findById(_id, attSelection);
        await this.checkRefBeforeDelete(book);
        const result = await this.bookModel.deleteOne({ _id: book._id });
        return result.deletedCount;
    }

    async deleteAll() {
        const attSelection = { book: '_id title' };
        const books = await this.findAll({}, attSelection);

        await Promise.all(books.map(async (book) => await this.checkRefBeforeDelete(book)));

        const result = await this.bookModel.deleteMany({});
        return result.deletedCount;
    }
    
}

module.exports = BookService;