const mongoose = require('mongoose');
const { String } = mongoose.Schema.Types;

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    }
});

const Author = mongoose.model('Author', authorSchema);
module.exports = Author;