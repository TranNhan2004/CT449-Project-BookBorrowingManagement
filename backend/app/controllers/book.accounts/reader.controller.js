const ReaderService = require('../../services/book.accounts/reader.service');
const { readerMessages, processMessages } = require('../../messages/vi.message');
const { asyncHandler } = require('../../utils/asyncHandler.util');

const readerService = new ReaderService();
const collName = readerMessages.reader; // The name of the collection


exports.create = asyncHandler(async (req, res) => {
    const payload = { ...req.body };
    const reader = await readerService.create(payload);
    return res.status(201).json({ 
        success: true, 
        message: processMessages.success(`Tạo thông tin ${collName} mới`),
        data: reader 
    });
}, processMessages.serverError(`tạo thông tin ${collName} mới`));


exports.findAll = asyncHandler(async (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : { reader: '-user' };

    if (attSelection.user) {
        if (!attSelection.user.include('-_id')) {
            attSelection.user += '-_id';
        }
        if (!attSelection.staff.include('-password')) {
            attSelection.user += '-password';
        }
    }
    
    const readers = await readerService.findAll(filter, attSelection);
    return res.status(200).json({ 
        success: true, 
        data: readers 
    });
}, processMessages.serverError(`tìm tất cả ${collName} với truy vấn`));


exports.findById = asyncHandler(async (req, res) => {
    const _id = req.params.readerId;
    const attSelection = { reader: '-_id', user: '-_id' };
    const reader = await readerService.findById(_id, attSelection);
    return res.status(200).json({ 
        success: true, 
        data: reader 
    });
    
}, processMessages.serverError(`tìm thông tin ${collName} với ID`));


exports.updateBasicInfoById = asyncHandler(async(req, res) => {
    const _id = req.params.readerId;
    const payload = { ...req.body };

    const result = await readerService.updateBasicInfoById(_id, payload);
    return res.status(200).json({ 
        success: true, 
        message: processMessages.success(`Cập nhật thông tin cơ bản của ${collName} theo ID`),
        data: result
    });

}, processMessages.serverError(`cập nhật thông tin cơ bản của ${collName} theo ID`));


exports.updatePasswordById = asyncHandler(async (req, res) => {
    const _id = req.params.readerId;
    const { oldPassword, newPassword } = req.body;

    const result = await readerService.updatePasswordById(_id, oldPassword, newPassword);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Đổi mật khẩu của ${collName} theo ID`),
        data: result,
    });
}, processMessages.serverError(`đổi mật khẩu của ${collName} theo ID`));


exports.deleteById = asyncHandler(async (req, res) => {
    const _id = req.params.readerId;

    await readerService.deleteById(_id);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá ${collName} theo ID`),
    });
}, processMessages.serverError(`xoá ${collName} theo ID`));


exports.deleteAll = asyncHandler(async (_req, res) => {
    const deletedCount = await readerService.deleteAll();

    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá tất cả (${deletedCount}) ${collName}`),
    });
}, processMessages.serverError(`xoá tất cả ${collName}`));


