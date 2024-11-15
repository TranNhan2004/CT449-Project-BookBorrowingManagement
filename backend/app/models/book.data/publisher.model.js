const mongoose = require('mongoose');
const { String } = mongoose.Schema.Types;
const { db } = require('../../config');
const publisherConfig = db.collections.publisher;

const publisherSchema = new mongoose.Schema({
    publicId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    }
});

const Publisher = mongoose.model('Publisher', publisherSchema);
module.exports = { Publisher, publisherConfig };