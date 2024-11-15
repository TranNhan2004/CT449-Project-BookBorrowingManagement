const mongoose = require('mongoose');
const { ObjectId, String, Number } = mongoose.Schema.Types;
const { db } = require('../../config');
const bookRecommendationConfig = db.collections.bookRecommendation;

const bookRecommendationSchema = new mongoose.Schema({
    recommendedBy: {
        type: ObjectId,
        ref: 'Reader',
        required: true
    },
    approvedBy: {
        type: ObjectId,
        ref: 'Staff',
        default: null
    },
    bookTitle: {
        type: String,
        trim: true,
        required: true
    },
    authorsName: [
        {
            type: String,
            trim: true,
            unique: true,
            required: true
        }
    ],
    publishedYear: {
        type: Number,
        min: bookRecommendationConfig.getMinPublishedYear(),
        max: bookRecommendationConfig.getMaxPublishedYear(),
        required: true
    },
    bookCoverImage: {
        type: Buffer,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: String,
        enum: bookRecommendationConfig.statusEnum,
        default: bookRecommendationConfig.statusEnum[0],
        required: true
    },
    rejectedReason: {
        type: String,
        trim: true,
        default: ''
    }
});

const BookRecommendation = mongoose.model('BookRecommendation', bookRecommendationSchema);
module.exports = { BookRecommendation, bookRecommendationConfig };