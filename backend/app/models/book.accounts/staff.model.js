const mongoose = require('mongoose');
const { ObjectId, String } = mongoose.Schema.Types;
const { db } = require('../../config');
const staffConfig = db.collections.staff;

const staffSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    position: {
        type: String,
        enum: staffConfig.positionEnum,
        required: true,
    }
});

const Staff = mongoose.model('Staff', staffSchema);
module.exports = { Staff, staffConfig };