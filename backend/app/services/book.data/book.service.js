const { Book, bookConfig } = require('../../models/book.data/book.model');
const { BookItem } = require('../../models/book.data/bookItem.model');
const { Favorite } = require('../../models/book.services/favorite.model');
const { bookMessages, 
        bookItemMessages,
        favoriteMessages, 
        reviewMessages, 
        processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');
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
            language: payload.language,
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
            throw new APIError(400, bookMessages.requiredAuthors);

        } else if (!isDefined(payload.publisher)) {
            throw new APIError(400, bookMessages.requiredPublisher);
        
        } else if (!isDefined(payload.addedBy)) {
            throw new APIError(400, bookMessages.requiredAddedBy);
        
        } else if (!isDefined(payload.title)) {
            throw new APIError(400, bookMessages.requiredTitle);
        
        } else if (!isDefined(payload.image)) {
            throw new APIError(400, bookMessages.requiredImage);
        
        } else if (!isDefined(payload.price)) {
            throw new APIError(400, bookMessages.requiredPrice);
        
        } else if (!isDefined(payload.publishedYear)) {
            throw new APIError(400, bookMessages.requiredPublishedYear);    
        
        } else if (!isDefined(payload.topics) || payload.topics.length === 0) {
            throw new APIError(400, bookMessages.requiredTopics);

        } else if (!isDefined(payload.language)) {
            throw new APIError(400, bookMessages.requiredLanguage);
        }

        return true;

    }

    async checkTopicsMaxLength(payload) {
        const maxLength = this.bookConfig.topicsMaxLength;
        if (payload.topics.length > maxLength) {
            throw new APIError(400, bookMessages.topicsMaxLength(maxLength));
        }
        return true;
    }

    async checkLanguage(payload) {
        if (!this.bookConfig.languageEnum.includes(payload.language)) {
            throw new APIError(400, bookMessages.invalidLanguage);
        }
        return true;
    }

    async checkPublishedYear(payload) {
        const minYear = this.bookConfig.getMinPublishedYear();
        const maxYear = this.bookConfig.getMaxPublishedYear();
        if (payload.publishedYear < minYear || payload.publishedYear > maxYear) {
            throw new APIError(400, bookMessages.invalidPublishedYear(minYear, maxYear));
        }
        return true;
    }

    async checkPrice(payload) {
        const minPrice = this.bookConfig.minPrice;
        if (payload.price < minPrice) {
            throw new APIError(400, bookMessages.invalidPrice(minPrice));
        }
        return true;
    }

    async create(payload) {
        // Validate required fields
        await this.checkRequiredFields(payload);
    
        // Perform individual checks for constraints
        await this.checkTopicsMaxLength(payload);
        await this.checkLanguage(payload);
        await this.checkPublishedYear(payload);
        await this.checkPrice(payload);
    
        // Prepare attribute selection for foreign key validation
        const authorAttSelection = { author: '_id' };
        const publisherAttSelection = { publisher: '_id' };
        const staffAttSelection = { staff: '_id' };
        const topicAttSelection = { topic: '_id' };
    
        // Validate foreign keys in parallel
        const authorChecks = payload.authors.map(authorId => authorService.findById(authorId, authorAttSelection));
        const topicChecks = payload.topics.map(topicId => topicService.findById(topicId, topicAttSelection));
    
        await Promise.all([
            Promise.all(authorChecks), // Validate all authors
            Promise.all(topicChecks), // Validate all topics
            publisherService.findById(payload.publisher, publisherAttSelection), // Validate publisher
            staffService.findById(payload.addedBy, staffAttSelection), // Validate staff
        ]);
    
        // Check for duplicate authors
        const authorSet = new Set(payload.authors);
        if (authorSet.size !== payload.authors.length) {
            throw new APIError(409, bookMessages.existedAuthor);
        }
    
        // Check for duplicate topics
        const topicSet = new Set(payload.topics);
        if (topicSet.size !== payload.topics.length) {
            throw new APIError(409, bookMessages.existedTopic);
        }
    
        // Extract book data from payload
        const bookData = await this.extractBookData(payload);
    
        // Increment the public book ID counter for the main topic
        const mainTopic = await topicService.incrementPublicBookIdCounter(bookData.topics[0]);
    
        // Generate and set the public ID for the book
        bookData.publicId = `${mainTopic.publicId}.${formatPublicId(
            mainTopic.publicBookIdCounter,
            this.bookConfig.publicIdSuffixLength
        )}`;
    
        // Create and save the new book document
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
            throw new APIError(404, processMessages.notFound(bookMessages.book, { id: _id }));
        }

        const fkSelections = await this.extractFKSelections(attSelection);
        return await book.populate(fkSelections);
    }

    async updateBasicInfoById(_id, payload) {
        delete payload.authors;
        delete payload.publisher;
        delete payload.addedBy;
        delete payload.topics;
    
        if (isDefined(payload.language)) {
            await this.checkLanguage(payload);
        }
    
        if (isDefined(payload.publishedYear)) {
            await this.checkPublishedYear(payload);
        }
    
        if (isDefined(payload.price)) {
            await this.checkPrice(payload);
        }
    
        const updatedData = await this.extractBookData(payload);
        const book = await this.findById(_id);
    
        Object.assign(book, updatedData);
        return await book.save();
    }
    
    async updateItemNumberById(_id, increment) {
        const book = await this.findById(_id);

        book.itemNumber = Math.max(book.itemNumber + increment, 0);
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
    
    async updateVisibilityById(_id, isVisible) {
        const book = await this.findById(_id);
    
        book.isVisible = isVisible;
        return await book.save();
    }
    
    async checkRefBeforeDelete(book) {
        const filter = { book: book._id };
        if (await BookItem.exists(filter)) {
            throw new APIError(400, processMessages.foreignKeyDeletionError(
                bookMessages.book,
                book.title,
                bookItemMessages.bookItem
            ));
        }

        if (await Favorite.exists(filter)) {
            throw new APIError(400, processMessages.foreignKeyDeletionError(
                bookMessages.book,
                book.title,
                favoriteMessages.favorite
            ));
        }

        if (await Review.exists(filter)) {
            throw new APIError(400, processMessages.foreignKeyDeletionError(
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