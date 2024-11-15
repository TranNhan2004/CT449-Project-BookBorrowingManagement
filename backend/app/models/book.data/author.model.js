const mongoose = require('mongoose');
const { String } = mongoose.Schema.Types;
const { db } = require('../../config');
const authorConfig = db.collections.author;

const authorSchema = new mongoose.Schema({
    publicId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    }
});

const Author = mongoose.model('Author', authorSchema);
module.exports = { Author, authorConfig };