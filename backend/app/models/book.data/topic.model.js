const mongoose = require('mongoose');
const { String } = mongoose.Schema.Types;
const { db } = require('../../config');
const topicConfig = db.collections.topic;

const topicSchema = new mongoose.Schema({
    publicId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    publicBookIdCounter: {
        type: Number,
        default: 0,
        min: 0,
    }
});

const Topic = mongoose.model('Topic', topicSchema);
module.exports = { Topic, topicConfig };