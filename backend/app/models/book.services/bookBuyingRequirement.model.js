const mongoose = require('mongoose');

const BookBuyingRequirementSchema = mongoose.Schema({
    requiredBy: {
        type: ObjectId,
        ref: 'Reader',
        required: true
    },
    bookID: {
        type: String,
        ref: 'Book',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    approvedBy: {
        type: ObjectId,
        ref: 'Employee'
    },
    number: {
        type: Number,
        min: 1,
        required: true
    },
    status: {
        type: String,
        enum: ['Đang Chờ', 'Đã Phê Duyệt', 'Đã Thanh Toán', 'Chờ Giao Hàng', 'Đã Nhận Hàng', 'Từ Chối', 'Hủy Đơn'],
        default: 'Đang Chờ',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    estimatedReceivingDate: {
        type: Date,
        default: null,
    },
});

const BookBuyingRequirement = mongoose.model('BookBuyingRequirement', BookBuyingRequirementSchema);
module.exports = BookBuyingRequirement;