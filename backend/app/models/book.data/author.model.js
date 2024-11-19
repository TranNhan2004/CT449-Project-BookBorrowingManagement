const mongoose = require('mongoose');
const { String } = mongoose.Schema.Types;
const { db } = require('../../config');

const authorSchema = new mongoose.Schema({
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
module.exports = { Author };