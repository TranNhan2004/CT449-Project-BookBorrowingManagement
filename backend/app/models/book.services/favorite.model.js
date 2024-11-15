const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const favoriteSchema = new mongoose.Schema({
    reader: {
        type: ObjectId,
        ref: 'Reader',
        required: true,
    },
    book: {
        type: ObjectId,
        ref: 'Book',
        required: true,
    }
});

const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = { Favorite };