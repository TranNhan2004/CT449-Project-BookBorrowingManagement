const mongoose = require('mongoose');
const { String } = mongoose.Schema.Types;

const publisherSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    }
});

const Publisher = mongoose.model('Publisher', publisherSchema);
module.exports = Publisher;