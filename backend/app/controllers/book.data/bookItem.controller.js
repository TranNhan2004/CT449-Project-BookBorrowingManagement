const BookItemService = require('../../services/book.data/bookItem.service');
const { bookItemMessages, processMessages } = require('../../messages/vi.message');
const { asyncHandler } = require('../../utils/asyncHandler.util');  

const bookItemService = new BookItemService();
const collName = bookItemMessages.bookItem; // The name of the collection


exports.create = asyncHandler(async (req, res) => {
    const payload = { ...req.body };

    const bookItem = await bookItemService.create(payload);
    return res.status(201).json({
        success: true,
        message: processMessages.success(`Tạo thông tin ${collName} mới`),
        data: bookItem
    });
}, processMessages.serverError(`Tạo thông tin ${collName} mới`));


exports.findAll = asyncHandler(async (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : {};

    const bookItems = await bookItemService.findAll(filter, attSelection);
    return res.status(200).json({
        success: true,
        data: bookItems
    });
}, processMessages.serverError(`Tìm tất cả ${collName}`));


exports.findById = asyncHandler(async (req, res) => {
    const _id = req.params.bookItemId;
    const attSelection = { bookItem: '' };

    const bookItem = await bookItemService.findById(_id, attSelection);
    return res.status(200).json({
        success: true,
        data: bookItem
    });
}, processMessages.serverError(`Tìm thông tin ${collName} với ID`));


exports.deleteById = asyncHandler(async (req, res) => {
    const _id = req.params.bookItemId;

    await bookItemService.deleteById(_id);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá ${collName} theo ID`)
    });
}, processMessages.serverError(`Xoá ${collName} theo ID`));


exports.deleteAll = asyncHandler(async (_req, res) => {
    const deletedCount = await bookItemService.deleteAll();
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá tất cả (${deletedCount}) ${collName}`)
    });
}, processMessages.serverError(`Xoá tất cả ${collName}`));
