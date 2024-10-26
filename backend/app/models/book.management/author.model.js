const mongoose = require('mongoose');

const AuthorSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    }
});

const Author = mongoose.model('Author', AuthorSchema);
module.exports = Author;