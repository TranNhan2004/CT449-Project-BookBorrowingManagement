const StaffService = require('../../services/book.accounts/staff.service');
const { processMessages } = require('../../messages/vi.message');
const APIError = require('../../utils/error.util');
const staffService = new StaffService();

const create = async (req, res, next) => {
    try {
        const user = await staffService.create(req.body);
        return res.status(201).json({ 
            success: true, 
            data: user 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500,
                processMessages.serverError('tạo thông tin nhân viên mới')
            )
        );
    }
};

const findAll = async (req, res, next) => {
    try {
        const users = await staffService.findAll(req.query);
        return res.status(200).json({ 
            success: true, 
            data: users 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, 
                processMessages.serverError(`tìm tất cả nhân viên với truy vấn ${JSON.stringify(req.query)}`)
            )
        );
    }
};

const findById = async (req, res, next) => {
    try {
        const user = await staffService.findById(req.params.staffId);
        return res.status(200).json({ 
            success: true, 
            data: user 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, 
                processMessages.serverError(`tìm thông tin nhân viên với ID: ${req.params.staffId}`)
            )
        );
    }
};

const findOne = async (req, res, next) => {
    try {
        const user = await staffService.findOne(req.query);
        return res.status(200).json({ 
            success: true, 
            data: user 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, 
                processMessages.serverError(`tìm thông tin nhân viên có ${JSON.stringify(req.query)}`)
            )
        );
    }
};


const updateBasicInfoById = async (req, res, next) => {
    try {
        await staffService.updateBasicInfoById(req.params.staffId, req.body);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`cập nhật thông tin cơ bản của nhân viên theo ID: ${req.params.staffId}`) 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, 
                processMessages.serverError(`cập nhật thông tin cơ bản của nhân viên theo ID: ${req.params.staffId}`)
            )
        );
    }
};

const changePassword = async (req, res, next) => {
    try {
        await staffService.changePassword(req.params.staffId, req.body.oldPassword, req.body.newPassword);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`đổi mật khẩu của nhân viên theo ID: ${req.params.staffId}`) 
        });
    } catch (err) {
        next(err instanceof APIError? 
            err : new APIError(500, 
                processMessages.serverError(`đổi mật khẩu của nhân viên theo ID: ${req.params.staffId}`)
            )
        );
    }
}

const deleteById = async (req, res, next) => {
    try {
        await staffService.deleteById(req.params.staffId);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`xoá nhân viên theo ID: ${req.params.staffId}`) 
        });
    } catch (err) {
        next(err instanceof APIError? 
            err : new APIError(500, 
                processMessages.serverError(`xoá nhân viên theo ID: ${req.params.staffId}`)
            )
        );
    }
};

const deleteAll = async(_req, res, next) => {
    try {
        const count = await staffService.deleteAll();
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`xoá tất cả (${count}) nhân viên`) 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, 
                processMessages.serverError('xoá tất cả nhân viên')
            )
        );
    }
}

const disable = async (req, res, next) => {
    try {
        await staffService.disable(req.params.staffId);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`vô hiệu hóa tài khoản nhân viên tại ID: ${req.params.staffId}`) 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, 
                processMessages.serverError(`vô hiệu hóa tài khoản nhân viên tại ID: ${req.params.staffId}`)
            )
        );
    }
}

module.exports = {
    create,
    findAll,
    findById,
    findOne,
    updateBasicInfoById,
    changePassword,
    deleteById,
    deleteAll,
    disable
};

