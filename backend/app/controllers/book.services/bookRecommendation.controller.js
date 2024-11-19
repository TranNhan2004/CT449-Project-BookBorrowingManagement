const BookRecommendationService = require('../../services/book.services/bookRecommendation.service');
const { bookRecommendationMessages, processMessages } = require('../../messages/vi.message');
const { asyncHandler } = require('../../utils/asyncHandler.util');  

const bookRecommendationService = new BookRecommendationService();
const collName = bookRecommendationMessages.bookRecommendation; // The name of the collection

exports.create = asyncHandler(async (req, res) => {
    const payload = JSON.parse(req.body.text);
    payload.bookCoverImage = req.file.buffer;

    const bookRecommendation = await bookRecommendationService.create(payload);

    const attSelection = { bookRecommendation: '-bookCoverImage' };
    const result = await bookRecommendationService.findById(bookRecommendation._id, attSelection);

    return res.status(201).json({
        success: true,
        message: processMessages.success(`Tạo thông tin ${collName} mới`),
        data: result
    });
}, processMessages.serverError(`Tạo thông tin ${collName} mới`));


exports.findAll = asyncHandler(async (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : {};

    const bookRecommendations = await bookRecommendationService.findAll(filter, attSelection);
    return res.status(200).json({
        success: true,
        data: bookRecommendations
    });
}, processMessages.serverError(`Tìm tất cả ${collName}`));


exports.findById = asyncHandler(async (req, res) => {
    const _id = req.params.bookRecommendationId;
    const attSelection = { bookRecommendation: '' };

    const bookRecommendation = await bookRecommendationService.findById(_id, attSelection);
    return res.status(200).json({
        success: true,
        data: bookRecommendation
    });
}, processMessages.serverError(`Tìm thông tin ${collName} với ID`));


exports.updateStatusById = asyncHandler(async (req, res) => {
    const _id = req.params.bookRecommendationId;
    const { approvedBy, status } = req.body;

    const result = await bookRecommendationService.updateStatusById(_id, approvedBy, status);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Cập nhật trạng thái của ${collName} theo ID`),
        data: result
    });
}, processMessages.serverError(`Cập nhật trạng thái của ${collName} theo ID`));


exports.deleteById = asyncHandler(async (req, res) => {
    const _id = req.params.bookRecommendationId;

    await bookRecommendationService.deleteById(_id);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá ${collName} theo ID`)
    });
}, processMessages.serverError(`Xoá ${collName} theo ID`));


exports.deleteAll = asyncHandler(async (_req, res) => {
    const deletedCount = await bookRecommendationService.deleteAll();
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá tất cả (${deletedCount}) ${collName}`)
    });
}, processMessages.serverError(`Xoá tất cả ${collName}`));
