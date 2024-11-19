const { Review, reviewConfig } = require('../../models/book.services/review.model');
const { reviewMessages, processMessages } = require('../../messages/vi.message');
const { ApiError } = require('../../utils/error.util');
const { getValidatedId, isDefined } = require('../../utils/validation.util');

const ReaderService = require('../book.accounts/reader.service');
const BookService = require('../book.data/book.service');

const readerService = new ReaderService();
const bookService = new BookService();

class ReviewService {

    constructor() {
        this.reviewModel = Review;
        this.reviewConfig = reviewConfig;
    }

    async extractReviewData(payload) {
        const reviewData = {
            reader: payload.reader,
            book: payload.book,
            rating: payload.rating,
            comment: payload.comment,
        };

        Object.keys(reviewData).forEach(
            key => !isDefined(reviewData[key]) && delete reviewData[key]
        );

        return reviewData;
    }

    async checkRequiredFields(payload) {
        if (!isDefined(payload.reader)) {
            throw new ApiError(400, reviewMessages.requiredReader);
        }

        if (!isDefined(payload.book)) {
            throw new ApiError(400, reviewMessages.requiredBook);
        }
        
        if (!isDefined(payload.rating)) {
            throw new ApiError(400, reviewMessages.requiredRating);
        }

        if (!isDefined(payload.comment)) {
            throw new ApiError(400, reviewMessages.requiredComment);
        }

        return true;
    }

    async checkRating(payload) {
        if (!this.reviewConfig.ratingEnum.includes(payload.rating)) {
            throw new ApiError(400, reviewMessages.invalidRating);
        }

        return true;
    }

    async checkCommentMaxLength(payload) {
        const maxLength = this.reviewConfig.commentMaxLength;
        if (payload.comment.length > maxLength) {
            throw new ApiError(400, reviewMessages.commentMaxLength(maxLength));
        }

        return true;
    }

    async create(payload) {
        await this.checkRequiredFields(payload);
        await this.checkRating(payload);
        await this.checkCommentMaxLength(payload);
        
        const readerAttSelection = { reader: '_id' };
        const bookAttSelection = { book: '_id' };
        await Promise.all([
            readerService.findById(payload.reader, readerAttSelection),
            bookService.findById(payload.book, bookAttSelection)
        ])

        const reviewData = await this.extractReviewData(payload);
        reviewData.createdAt = new Date();

        const review = await this.reviewModel.create(reviewData);
        await this.updateAverageRatingForBook(review.book);
        return review;
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
        return await this.reviewModel.find(filter).select(attSelection.review || '').populate(fkSelections);
    }

    async findById(_id, attSelection = {}) {
        const validatedId = getValidatedId(_id);
        const review = await this.reviewModel.findById(validatedId).select(attSelection.review || '');
        if (!review) {
            throw new ApiError(404, processMessages.notFound(reviewMessages.review, { id: _id }));
        }
        const fkSelections = await this.extractFKSelections(attSelection);
        return await review.populate(fkSelections);
    }

    async updateAverageRatingForBook(bookId) {
        const filter = { book: bookId };
        const attSelection = { review: '_id rating' };
        const reviews = await this.findAll(filter, attSelection);

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        return await bookService.updateAverageRatingById(bookId, averageRating);
    }

    async updateRatingAndCommentById(_id, newRating, newComment) {
        if (!isDefined(newRating)) {
            throw new ApiError(400, reviewMessages.requiredRating);
        }
    
        if (!isDefined(newComment)) {
            throw new ApiError(400, reviewMessages.requiredComment);
        }
    
        await this.checkRating({ rating: newRating });
        await this.checkCommentMaxLength({ comment: newComment });
    
        const review = await this.findById(_id);
    
        review.rating = newRating;
        review.comment = newComment;
    
        await review.save();
        await this.updateAverageRatingForBook(review.book);
       
        return review; 
    }
    
    async deleteById(_id) {
        const attSelection = { review: '_id book', book: '_id' };
        const review = await this.findById(_id, attSelection);

        const result = await this.reviewModel.deleteOne({ _id: review._id });
        await this.updateAverageRatingForBook(review.book._id);
        return result.deletedCount;
    }

    async deleteAll() {
        const attSelection = { review: '_id book', book: '_id' };
        const reviews = await this.findAll({}, attSelection);

        const result = await this.reviewModel.deleteMany({});
        await Promise.all(reviews.map(async (review) => 
            await bookService.updateAverageRatingById(review.book._id, 0)
        ));

        return result.deletedCount;
    }   
}

module.exports = ReviewService;