const StaffService = require('../../services/book.accounts/staff.service');
const { staffMessages, processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');

const staffService = new StaffService();
const collName = staffMessages.staff; // The name of the collection

exports.create = async (req, res, next) => {
    const payload = { ...req.body };

    try {
        const staff = await staffService.create(payload);
        return res.status(201).json({ 
            success: true, 
            message: processMessages.success(`Tạo thông tin ${collName} mới`),
            data: staff 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tạo thông tin ${collName} mới`))
        );
    }
};

exports.findAll = async (req, res, next) => {
    const query = { ...req.query };
    const attSelection = { staff: '' };

    try {
        const staffs = await staffService.findAll(query, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: staffs 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm tất cả ${collName} với truy vấn 
                                                                ${JSON.stringify(query)}`.replace(/\s+/g, ' ')))
        );
    }
};


exports.findById = async (req, res, next) => {
    const _id = req.params.staffId;
    const attSelection = { staff: '' };
    
    try {
        const staff = await staffService.findById(_id, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: staff 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm thông tin ${collName} với ID: ${_id}`))
        );
    }
};

exports.updateBasicInfoById = async (req, res, next) => {
    const _id = req.params.staffId;
    const payload = { ...req.body };

    try {
        const result = await staffService.updateBasicInfoById(_id, payload);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Cập nhật thông tin cơ bản của ${collName} theo ID: ${_id}`),
            data: result
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`cập nhật thông tin cơ bản của
                                                                ${collName} theo ID: ${_id}`.replace(/\s+/g, ' ')))
        );
    }
};

exports.updatePhoneNumberById = async (req, res, next) => {
    const _id = req.params.staffId;
    const { newPhoneNumber } = req.body;

    try {
        const result = await staffService.updatePhoneNumberById(_id, newPhoneNumber);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Đổi số điện thoại của ${collName} theo ID: ${_id}`),
            data: result
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`đổi số điện thoại của 
                                                                ${collName} theo ID: ${_id}`.replace(/\s+/g, ' ')))
        );
    }
}

exports.updateEmailById = async (req, res, next) => {
    const _id = req.params.staffId;
    const { newEmail } = req.body;

    try {
        const result = await staffService.updateEmailById(_id, newEmail);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Đổi email của ${collName} theo ID: ${_id}`),
            data: result
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`đổi email của ${collName} theo ID: ${_id}`))
        );
    }
}

exports.updatePasswordById = async (req, res, next) => {
    const _id = req.params.staffId;
    const { oldPassword, newPassword } = req.body;

    try {
        const result = await staffService.updatePasswordById(_id, oldPassword, newPassword);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Đổi mật khẩu của ${collName} theo ID: ${_id}`),
            data: result 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`đổi mật khẩu của ${collName} theo ID: ${_id}`))
        );
    }
}

exports.updateValiationById = async (req, res, next) => {
    const _id = req.params.staffId;
    const { isValid } = req.body;

    try {
        const result = await staffService.updateValidationById(_id, isValid);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Cập nhật hiệu lực tài khoản của ${collName} theo ID: ${_id}`),
            data: result
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`cập nhật hiệu lực tài khoản của 
                                                                ${collName} theo ID: ${_id}`.replace(/\s+/g, ' ')))
        );
    }
}


exports.deleteById = async (req, res, next) => {
    const _id = req.params.staffId;

    try {
        await staffService.deleteById(_id);
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
        const deletedCount = await staffService.deleteAll();
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