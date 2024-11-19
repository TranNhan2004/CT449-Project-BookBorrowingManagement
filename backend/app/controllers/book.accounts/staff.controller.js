const StaffService = require('../../services/book.accounts/staff.service');
const { staffMessages, processMessages } = require('../../messages/vi.message');
const { asyncHandler } = require('../../utils/asyncHandler.util');

const staffService = new StaffService();
const collName = staffMessages.staff; // The name of the collection


exports.create = asyncHandler(async (req, res) => {
    const payload = { ...req.body };

    const staff = await staffService.create(payload);
    return res.status(201).json({ 
        success: true, 
        message: processMessages.success(`Tạo thông tin ${collName} mới`),
        data: staff 
    });
}, processMessages.serverError(`tạo thông tin ${collName} mới`));


exports.findAll = asyncHandler(async (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : { staff: '-user -position' };

    if (attSelection.user) {
        if (!attSelection.user.include('-_id')) {
            attSelection.user += '-_id';
        }
        if (!attSelection.staff.include('-password')) {
            attSelection.user += '-password';
        }
    }

    const staffs = await staffService.findAll(filter, attSelection);
    return res.status(200).json({ 
        success: true, 
        data: staffs 
    });
}, processMessages.serverError(`tìm tất cả ${collName}`));


exports.findById = asyncHandler(async (req, res) => {
    const _id = req.params.staffId;
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : { staff: '-user -position' };
    
    const staff = await staffService.findById(_id, attSelection);
    return res.status(200).json({ 
        success: true, 
        data: staff 
    });
}, processMessages.serverError(`tìm thông tin ${collName} theo ID`));


exports.updateBasicInfoById = asyncHandler(async (req, res) => {
    const _id = req.params.staffId;
    const payload = { ...req.body };

    const result = await staffService.updateBasicInfoById(_id, payload);
    return res.status(200).json({ 
        success: true, 
        message: processMessages.success(`Cập nhật thông tin cơ bản của ${collName} theo ID`),
        data: result
    });
}, processMessages.serverError(`cập nhật thông tin cơ bản của ${collName} theo ID`));


exports.updatePasswordById = asyncHandler(async (req, res) => {
    const _id = req.params.staffId;
    const { oldPassword, newPassword } = req.body;

    const result = await staffService.updatePasswordById(_id, oldPassword, newPassword);
    return res.status(200).json({ 
        success: true, 
        message: processMessages.success(`Đổi mật khẩu của ${collName} theo ID`),
        data: result 
    });
}, processMessages.serverError(`đổi mật khẩu của ${collName} theo ID`));


exports.deleteById = asyncHandler(async (req, res) => {
    const _id = req.params.staffId;
    await staffService.deleteById(_id);
    return res.status(200).json({ 
        success: true, 
        message: processMessages.success(`Xoá ${collName} theo ID`) 
    });
}, processMessages.serverError(`xoá ${collName} theo ID`));


exports.deleteAll = asyncHandler(async (_req, res) => {
    const deletedCount = await staffService.deleteAll();
    return res.status(200).json({ 
        success: true, 
        message: processMessages.success(`Xoá tất cả (${deletedCount}) ${collName}`) 
    });
}, processMessages.serverError(`xoá tất cả ${collName}`));


exports.getMe = asyncHandler(async (req, res) => {
    const _id = req.specificUser._id;
    const attSelection = { staff: '_id position' };
    
    const staff = await staffService.findById(_id, attSelection);
    return res.status(200).json({ 
        success: true, 
        data: staff 
    });
}, processMessages.serverError(`lấy thông tin của tôi`));


exports.updateMe = asyncHandler(async (req, res) => {
    const _id = req.specificUser._id;
    const payload = { ...req.body };
    
    const result = await staffService.updateBasicInfoById(_id, payload);
    return res.status(200).json({ 
        success: true, 
        message: processMessages.success(`Cập nhật thông tin cơ bản của tôi`),
        data: result
    });
}, processMessages.serverError('cập nhật thông tin cơ bản của tôi'));