const UserService = require('../../services/book.accounts/user.service');
const { processMessages } = require('../../messages/vi.message');
const APIError = require('../../utils/error.util');
const userService = new UserService();

const create = async (req, res, next) => {
    try {
        const user = await userService.create(req.body);
        return res.status(201).json({ 
            success: true, 
            data: user 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500,
                processMessages.serverError('tạo thông tin người dùng mới')
            )
        );
    }
};

const findAll = async (req, res, next) => {
    try {
        const users = await userService.findAll(req.query);
        return res.status(200).json({ 
            success: true, 
            data: users 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, 
                processMessages.serverError(`tìm tất cả người dùng với truy vấn ${JSON.stringify(req.query)}`)
            )
        );
    }
};

const findById = async (req, res, next) => {
    try {
        const user = await userService.findById(req.params.userId);
        return res.status(200).json({ 
            success: true, 
            data: user 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, 
                processMessages.serverError(`tìm thông tin người dùng với ID: ${req.params.userId}`)
            )
        );
    }
};

const findOne = async (req, res, next) => {
    try {
        const user = await userService.findOne(req.query);
        return res.status(200).json({ 
            success: true, 
            data: user 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, 
                processMessages.serverError(`tìm thông tin người dùng có ${JSON.stringify(req.query)}`)
            )
        );
    }
};


const updateBasicInfoById = async (req, res, next) => {
    try {
        await userService.updateBasicInfoById(req.params.userId, req.body);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`cập nhật thông tin cơ bản của người dùng theo ID: ${req.params.userId}`) 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, 
                processMessages.serverError(`cập nhật thông tin cơ bản của người dùng theo ID: ${req.params.userId}`)
            )
        );
    }
};

const changePassword = async (req, res, next) => {
    try {
        await userService.changePassword(req.params.userId, req.body.oldPassword, req.body.newPassword);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`đổi mật khẩu của người dùng theo ID: ${req.params.userId}`) 
        });
    } catch (err) {
        next(err instanceof APIError? 
            err : new APIError(500, 
                processMessages.serverError(`đổi mật khẩu của người dùng theo ID: ${req.params.userId}`)
            )
        );
    }
}

const deleteById = async (req, res, next) => {
    try {
        await userService.deleteById(req.params.userId);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`xoá người dùng theo ID: ${req.params.userId}`) 
        });
    } catch (err) {
        next(err instanceof APIError? 
            err : new APIError(500, 
                processMessages.serverError(`xoá người dùng theo ID: ${req.params.userId}`)
            )
        );
    }
};

const deleteAll = async(_req, res, next) => {
    try {
        const count = await userService.deleteAll();
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`xoá tất cả (${count}) người dùng`) 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, 
                processMessages.serverError('xoá tất cả người dùng')
            )
        );
    }
}

const disable = async (req, res, next) => {
    try {
        await userService.disable(req.params.userId);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`vô hiệu hóa tài khoản người dùng tại ID: ${req.params.userId}`) 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, 
                processMessages.serverError(`vô hiệu hóa tài khoản người dùng tại ID: ${req.params.userId}`)
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

