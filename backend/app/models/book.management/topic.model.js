const mongoose = require('mongoose');
const { String } = mongoose.Schema.Types;

const topicSchema = new mongoose.Schema({
    topicId: {
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

const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;