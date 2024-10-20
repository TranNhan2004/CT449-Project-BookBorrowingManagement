const mongoose = require('mongoose');

const BookRecommendationSchema = mongoose.Schema({
    recommendedBy: {
        type: ObjectId,
        ref: 'Reader',
        required: true
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
    approvedBy: {
        type: ObjectId,
        ref: 'Employee'
    },
    publishYear: {
        type: Number,
        min: 1800,
        max: new Date().getFullYear(),
        required: true
    },
    status: {
        type: String,
        enum: ['Đang Chờ', 'Đã Phê Duyệt', 'Từ Chối'],
        default: 'Đang Chờ',
        required: true
    }
});

const BookRecommendation = mongoose.model('BookRecommendation', BookRecommendationSchema);
module.exports = BookRecommendation;