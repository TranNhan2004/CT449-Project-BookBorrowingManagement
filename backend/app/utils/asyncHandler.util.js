const { ApiError } = require("./error.util");

const asyncHandler = (fn, serverErrorMessage = null) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            next(err instanceof ApiError ?
                err : new ApiError(500, serverErrorMessage, { reason: err.message, stack: err.stack })
            );
        });
    };
};

module.exports = { asyncHandler };
