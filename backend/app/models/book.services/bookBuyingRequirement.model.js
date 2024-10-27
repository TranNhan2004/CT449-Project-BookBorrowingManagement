const mongoose = require('mongoose');
const { ObjectId, String, Date, Number } = mongoose.Schema.Types;

const bookBuyingRequirementSchema = new mongoose.Schema({
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
        ref: 'Staff',
        default: null,
    },
    number: {
        type: Number,
        min: 1,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'is-paid', 'delivering', 'recieved', 'rejected', 'cancelled'],
        default: 'pending',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    estimatedReceivingDate: {
        type: Date,
        default: null,
    }
});

const BookBuyingRequirement = mongoose.model('BookBuyingRequirement', bookBuyingRequirementSchema);
module.exports = BookBuyingRequirement;