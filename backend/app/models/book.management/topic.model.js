const mongoose = require('mongoose');

const TopicSchema = mongoose.Schema({
    topicID: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        trim: true,
        required: true
    }
});

const Topic = mongoose.model('Topic', TopicSchema);
module.exports = Topic;