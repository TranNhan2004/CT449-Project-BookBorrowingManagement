const BookBorrowingService = require('../../services/book.services/bookBorrowing.service');
const { bookBorrowingMessages, processMessages } = require('../../messages/vi.message');
const { asyncHandler } = require('../../utils/asyncHandler.util');  

const bookBorrowingService = new BookBorrowingService();
const collName = bookBorrowingMessages.bookBorrowing; // The name of the collection


exports.create = asyncHandler(async (req, res) => {
    const payload = { ...req.body };

    const bookBorrowing = await bookBorrowingService.create(payload);
    return res.status(201).json({
        success: true,
        message: processMessages.success(`Tạo thông tin ${collName} mới`),
        data: bookBorrowing
    });
}, processMessages.serverError(`Tạo thông tin ${collName} mới`));


exports.findAll = asyncHandler(async (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : {};

    const bookBorrowings = await bookBorrowingService.findAll(filter, attSelection);
    return res.status(200).json({
        success: true,
        data: bookBorrowings
    });
}, processMessages.serverError(`Tìm tất cả ${collName}`));


exports.findById = asyncHandler(async (req, res) => {
    const _id = req.params.bookBorrowingId;
    const attSelection = { bookBorrowing: '' };

    const bookBorrowing = await bookBorrowingService.findById(_id, attSelection);
    return res.status(200).json({
        success: true,
        data: bookBorrowing
    });
}, processMessages.serverError(`Tìm thông tin ${collName} với ID`));


exports.returnBookItemById = asyncHandler(async (req, res) => {
    const _id = req.params.bookBorrowingId;

    const result = await bookBorrowingService.returnBookItemById(_id);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Trả bản sao sách theo ${collName} với ID: ${_id}`),
        data: result
    });
}, processMessages.serverError(`Trả bản sao sách theo ${collName} với ID`));


exports.extendDueDateById = asyncHandler(async (req, res) => {
    const _id = req.params.bookBorrowingId;

    const result = await bookBorrowingService.extendDueDateById(_id);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Gia hạn mượn sách của ${collName} với ID`),
        data: result
    });
}, processMessages.serverError(`Gia hạn mượn sách của ${collName} với ID`));


exports.checkDueDate = asyncHandler(async (req, res) => {
    const { borrowedBy } = req.body;

    const result = await bookBorrowingService.checkDueDate(borrowedBy);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Kiểm tra hết hạn của ${collName} theo độc giả`),
        data: result
    });
}, processMessages.serverError(`Kiểm tra hết hạn của ${collName} theo độc giả`));


exports.deleteById = asyncHandler(async (req, res) => {
    const _id = req.params.bookBorrowingId;

    await bookBorrowingService.deleteById(_id);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá ${collName} theo ID`)
    });
}, processMessages.serverError(`Xoá ${collName} theo ID`));


exports.deleteAll = asyncHandler(async (_req, res) => {
    const deletedCount = await bookBorrowingService.deleteAll();
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá tất cả (${deletedCount}) ${collName}`)
    });
}, processMessages.serverError(`Xoá tất cả ${collName}`));
