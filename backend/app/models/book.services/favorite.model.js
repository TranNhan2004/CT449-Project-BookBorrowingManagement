const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const favoriteSchema = new mongoose.Schema({
    readerId: {
        type: ObjectId,
        ref: 'Reader',
        required: true
    },
    bookId: {
        type: ObjectId,
        ref: 'Book',
        required: true
    }
});

const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;