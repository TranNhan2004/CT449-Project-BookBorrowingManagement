const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const saltRounds = 10; // Độ mạnh của bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};

module.exports = {
    hashPassword,
    comparePassword
};

