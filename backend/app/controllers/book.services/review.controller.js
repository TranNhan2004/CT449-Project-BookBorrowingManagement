const ReviewService = require('../../services/book.services/review.service');
const { reviewMessages, processMessages } = require('../../messages/vi.message');
const { asyncHandler } = require('../../utils/asyncHandler.util');  

const reviewService = new ReviewService();
const collName = reviewMessages.review; // The name of the collection


exports.create = asyncHandler(async (req, res) => {
    const payload = { ...req.body };

    const review = await reviewService.create(payload);
    return res.status(201).json({
        success: true,
        message: processMessages.success(`Tạo thông tin ${collName} mới`),
        data: review
    });
}, processMessages.serverError(`Tạo thông tin ${collName} mới`));


exports.findAll = asyncHandler(async (req, res) => {
    console.log(req.query.filter);
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : {};

    const reviews = await reviewService.findAll(filter, attSelection);
    return res.status(200).json({
        success: true,
        data: reviews
    });
}, processMessages.serverError(`Tìm tất cả ${collName}`));


exports.findById = asyncHandler(async (req, res) => {
    const _id = req.params.reviewId;
    const attSelection = { review: '' };

    const review = await reviewService.findById(_id, attSelection);
    return res.status(200).json({
        success: true,
        data: review
    });
}, processMessages.serverError(`Tìm thông tin ${collName} với ID`));


exports.updateRatingAndCommentById = asyncHandler(async (req, res) => {
    const _id = req.params.reviewId;
    const { newRating, newComment } = req.body;

    const result = await reviewService.updateRatingAndCommentById(_id, newRating, newComment);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Cập nhật chỉ số đánh giá và nội dung bình luận của ${collName} theo ID`),
        data: result
    });
}, processMessages.serverError(`Cập nhật chỉ số đánh giá và nội dung bình luận của ${collName} theo ID`));


exports.deleteById = asyncHandler(async (req, res) => {
    const _id = req.params.reviewId;

    await reviewService.deleteById(_id);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá ${collName} theo ID`)
    });
}, processMessages.serverError(`Xoá ${collName} theo ID`));


exports.deleteAll = asyncHandler(async (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const deletedCount = await reviewService.deleteAll(filter);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá tất cả (${deletedCount}) ${collName}`)
    });
}, processMessages.serverError(`Xoá tất cả ${collName}`));
