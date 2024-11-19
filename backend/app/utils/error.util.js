const { nodeEnv } = require('../config');

class ApiError extends Error {
    constructor(statusCode, message, detail = null) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.detail = detail;
    }
}

const errorHandler = (err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;

    const errorResponse = {
        success: false,
        message: err.message || 'Internal Server Error',
    };

    if (nodeEnv === 'dev') {
        errorResponse.detail = err.detail;
    }

    console.log(errorResponse);
    return res.status(statusCode).json(errorResponse);
};


module.exports = { ApiError, errorHandler };