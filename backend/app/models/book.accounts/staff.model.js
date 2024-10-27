const mongoose = require('mongoose');
const { ObjectId, String } = mongoose.Schema.Types;

const staffSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    position: {
        type: String,
        enum: ['admin', 'librarian'],
        required: true,
    }
});

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;