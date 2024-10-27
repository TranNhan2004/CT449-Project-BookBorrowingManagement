const mongoose = require('mongoose');
const { ObjectId, String, Number } = mongoose.Schema.Types;

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
    bookName: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    authorName: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    publishYear: {
        type: Number,
        min: 1800,
        max: new Date().getFullYear(),
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        required: true
    }
});

const BookRecommendation = mongoose.model('BookRecommendation', bookRecommendationSchema);
module.exports = BookRecommendation;