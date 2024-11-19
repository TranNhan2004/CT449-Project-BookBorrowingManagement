const mongoose = require('mongoose');
const { String } = mongoose.Schema.Types;
const { db } = require('../../config');

const publisherSchema = new mongoose.Schema({
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
module.exports = { Publisher };