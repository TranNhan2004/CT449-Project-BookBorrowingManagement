const mongoose = require('mongoose');

const BookTopicSchema = mongoose.Schema({
    bookID: {
        type: String,
        ref: 'Book',
        required: true
    },
    topicID: {
        type: String,
        ref: 'Topic',
        required: true
    },
});

const BookTopic = mongoose.model('BookTopic', BookTopicSchema);
module.exports = BookTopic;