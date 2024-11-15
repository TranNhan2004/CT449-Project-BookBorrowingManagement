const mongoose = require('mongoose');
const { String, Boolean, Date } = mongoose.Schema.Types;
const { db } = require('../../config');
const userConfig = db.collections.user;

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        trim: true,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    birth: {
        type: Date,
        min: userConfig.getMinBirth(),
        max: userConfig.getMaxBirth(),
        required: true
    },
    gender: {
        type: String,
        enum: userConfig.genderEnum,
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        enum: userConfig.roleEnum,
        required: true
    },
    isValid: {
        type: Boolean,
        default: true,
        required: true
    }
});

const User = mongoose.model('User', userSchema);
module.exports = { User, userConfig };