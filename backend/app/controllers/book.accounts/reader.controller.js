const ReaderService = require('../../services/book.accounts/reader.service');
const { readerMessages, processMessages } = require('../../messages/vi.message');
const { asyncHandler } = require('../../utils/asyncHandler.util');

const readerService = new ReaderService();
const collName = readerMessages.reader; 


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
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : {};

    const readers = await readerService.findAll(filter, attSelection);
    const processedreaders = [];

    readers.forEach(reader => {
        const readerCopy = reader.toObject();
        delete readerCopy.user?.password;
        processedreaders.push(readerCopy);
    });

    return res.status(200).json({ 
        success: true, 
        data: processedreaders
    });
}, processMessages.serverError(`tìm tất cả ${collName}`));


exports.findById = asyncHandler(async (req, res) => {
    const _id = req.params.readerId;
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : {};

    const reader = await readerService.findById(_id, attSelection);
    const processedReader = reader.toObject();
    delete processedReader.user?.password;

    return res.status(200).json({ 
        success: true, 
        data: processedReader 
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


exports.updateValidationById = asyncHandler(async (req, res) => {
    const _id = req.params.readerId;
    const { isValid } = req.body;

    const result = await readerService.updateValidationById(_id, isValid);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Cập nhật hiệu lực tài khoản của ${collName} theo ID`),
        data: result,
    });
}, processMessages.serverError(`cập nhật hiệu lực tài khoản của ${collName} theo ID`))


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


exports.getMe = asyncHandler(async (req, res) => {
    const _id = req.specificUser._id;
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : {};
    
    const reader = await readerService.findById(_id, attSelection);
    return res.status(200).json({ 
        success: true, 
        data: reader 
    });
}, processMessages.serverError(`lấy thông tin của tôi`));


exports.updateMe = asyncHandler(async (req, res) => {
    const _id = req.specificUser._id;
    const payload = { ...req.body };
    
    const result = await readerService.updateBasicInfoById(_id, payload);
    return res.status(200).json({ 
        success: true, 
        message: processMessages.success(`Cập nhật thông tin cơ bản của tôi`),
        data: result
    });
}, processMessages.serverError('cập nhật thông tin cơ bản'));


exports.changeMyPassword = asyncHandler(async (req, res) => {
    const _id = req.specificUser._id;
    const { oldPassword, newPassword, confirmedNewPassword } = req.body;

    const result = await readerService.updatePasswordById(_id, oldPassword, newPassword, confirmedNewPassword);
    return res.status(200).json({ 
        success: true, 
        message: processMessages.success(`Đổi mật khẩu`),
        data: result 
    });
}, processMessages.serverError(`đổi mật khẩu`));