const mongoose = require('mongoose');

const PublisherSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    }
});

const Publisher = mongoose.model('Publisher', PublisherSchema);
module.exports = Publisher;