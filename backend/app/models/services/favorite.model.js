const mongoose = require('mongoose');

const FavoriteSchema = mongoose.Schema({
    readerID: {
        type: ObjectId,
        ref: 'Reader',
        required: true
    },
    bookID: {
        type: ObjectId,
        ref: 'Book',
        required: true
    }
});

const Favorite = mongoose.model('Favorite', FavoriteSchema);
module.exports = Favorite;