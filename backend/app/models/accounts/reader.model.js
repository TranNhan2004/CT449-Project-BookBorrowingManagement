const mongoose = require('mongoose');

const ReaderSchema = mongoose.Schema({
    readerID: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    birth: {
        type: Date,
        required: true,
    },
    sex: {
        type: String,
        enum: ['Nam', 'Nữ', 'Không rõ'],
        required: true,
    },
    point: {
        type: Number,
        default: 10,
        required: true,
    },
    membership: {
        type: String,
        enum: ['Cơ Bản', 'Đồng', 'Bạc', 'Vàng', 'Kim Cương'],
        required: true,
    }

});

const Reader = mongoose.model('Reader', ReaderSchema);
module.exports = Reader;