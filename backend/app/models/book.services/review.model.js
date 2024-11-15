const mongoose = require('mongoose');
const { ObjectId, Number, String, Date } = mongoose.Schema.Types;
const { db } = require('../../config');
const reviewConfig = db.collections.review;

const reviewSchema = new mongoose.Schema({
    reader: { 
        type: ObjectId, 
        ref: 'Reader', 
        required: true 
    },
    book: {
        type: ObjectId,
        ref: 'Book',
        required: true
    },
    rating: {
        type: Number,
        enum: reviewConfig.ratingEnum,
        required: true,
    },
    comment: {
        type: String,
        trim: true,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true
    }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = { Review, reviewConfig };