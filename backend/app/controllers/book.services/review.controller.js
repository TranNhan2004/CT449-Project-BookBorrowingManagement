const ReviewService = require('../../services/book.services/review.service');
const { reviewMessages, processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');

const reviewService = new ReviewService();
const collName = reviewMessages.review; // The name of the collection

exports.create = async (req, res, next) => {
    const payload = { ...req.body };

    try {
        const review = await reviewService.create(payload);
        return res.status(201).json({ 
            success: true, 
            message: processMessages.success(`Tạo thông tin ${collName} mới`),
            data: review 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(err.message))
        );
    }
};
// `tạo thông tin ${collName} mới`

exports.findAll = async (req, res, next) => {
    const query = { ...req.query };
    const attSelection = { review: '' };

    try {
        const reviews = await reviewService.findAll(query, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: reviews 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm tất cả ${collName} với truy vấn 
                                                                    ${JSON.stringify(query)}`.replace(/\s+/g, ' ')))
        );
    }
};


exports.findById = async (req, res, next) => {
    const _id = req.params.reviewId;
    const attSelection = { review: '' };
    
    try {
        const review = await reviewService.findById(_id, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: review 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm thông tin ${collName} với ID: ${_id}`))
        );
    }
};

exports.updateRatingAndCommentById = async (req, res, next) => {
    const _id = req.params.reviewId;
    const { newRating, newComment } = req.body;

    try {
        const result = await reviewService.updateRatingAndCommentById(_id, newRating, newComment);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Cập nhật chỉ số đánh giá và nội dung bình luận của 
                                            ${collName} theo ID: ${_id}`.replace(/\s+/g, ' ')),
            data: result
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`cập nhật chỉ số đánh giá và nội dung bình luận của 
                                                                ${collName} theo ID: ${_id}`.replace(/\s+/g, ' ')))
        );
    }
};

exports.deleteById = async (req, res, next) => {
    const _id = req.params.reviewId;

    try {
        await reviewService.deleteById(_id);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Xoá ${collName} theo ID: ${_id}`) 
        });
    } catch (err) {
        next(err instanceof APIError? 
            err : new APIError(500, processMessages.serverError(`xoá ${collName} theo ID: ${_id}`))
        );
    }
};

exports.deleteAll = async(_req, res, next) => {
    try {
        const deletedCount = await reviewService.deleteAll();
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Xoá tất cả (${deletedCount}) ${collName}`) 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`xoá tất cả ${collName}`))
        );
    }
}