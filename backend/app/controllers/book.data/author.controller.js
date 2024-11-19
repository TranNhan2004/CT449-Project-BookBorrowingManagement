const AuthorService = require('../../services/book.data/author.service');
const { authorMessages, processMessages } = require('../../messages/vi.message');
const { asyncHandler } = require('../../utils/asyncHandler.util');

const authorService = new AuthorService();
const collName = authorMessages.author; // The name of the collection

exports.create = asyncHandler(async (req, res) => {
    const payload = { ...req.body };

    const author = await authorService.create(payload);
    return res.status(201).json({
        success: true,
        message: processMessages.success(`Tạo thông tin ${collName} mới`),
        data: author
    });
}, processMessages.serverError(`Tạo thông tin ${collName} mới`));


exports.findAll = asyncHandler(async (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : {};

    const authors = await authorService.findAll(filter, attSelection);
    return res.status(200).json({
        success: true,
        data: authors
    });
}, processMessages.serverError(`Tìm tất cả ${collName}`));


exports.findById = asyncHandler(async (req, res) => {
    const _id = req.params.authorId;
    const attSelection = { author: '' };

    const author = await authorService.findById(_id, attSelection);
    return res.status(200).json({
        success: true,
        data: author
    });
}, processMessages.serverError(`Tìm thông tin ${collName} với ID`));


exports.updateBasicInfoById = asyncHandler(async (req, res) => {
    const _id = req.params.authorId;
    const payload = { ...req.body };

    const result = await authorService.updateBasicInfoById(_id, payload);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Cập nhật thông tin cơ bản của ${collName} theo ID`),
        data: result
    });
}, processMessages.serverError(`Cập nhật thông tin cơ bản của ${collName} theo ID`));


exports.deleteById = asyncHandler(async (req, res) => {
    const _id = req.params.authorId;

    await authorService.deleteById(_id);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá ${collName} theo ID`)
    });
}, processMessages.serverError(`Xoá ${collName} theo ID`));


exports.deleteAll = asyncHandler(async (_req, res) => {
    const deletedCount = await authorService.deleteAll();

    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá tất cả (${deletedCount}) ${collName}`)
    });
}, processMessages.serverError(`Xoá tất cả ${collName}`));
