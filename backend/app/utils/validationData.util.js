const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types; 

const getValidatedId = (_id) => ObjectId.isValid(_id) ? new ObjectId(_id) : null;
const isDefined = (value) => value !== undefined && value !== null;

module.exports = { getValidatedId, isDefined };