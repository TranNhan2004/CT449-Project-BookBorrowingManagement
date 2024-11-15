const formatPublicId = (publicIdCounter, maxLength) => {
    return String(publicIdCounter).padStart(maxLength, '0');
}

module.exports = { formatPublicId };  