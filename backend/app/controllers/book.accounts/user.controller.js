const UserService = require('../../services/book.accounts/user.service');
const userMessage = require('../../messages/book.accounts/user.message');
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
                userMessage.serverError('tạo tài khoản')
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
                userMessage.serverError(`lấy tất cả tài khoản theo ${JSON.stringify(req.query)}`)
            )
        );
    }
};

const findOne = async (req, res, next) => {
    try {
        const user = await userService.findById(req.params.userID);
        return res.status(200).json({ 
            success: true, 
            data: user 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, 
                userMessage.serverError(`lấy thông tin tài khoản theo ID: ${req.params.userID}`)
            )
        );
    }
};

const update = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateById(req.params.userID, req.body);
        return res.status(200).json({ 
            success: true, 
            message: userMessage.success(`cập nhật tài khoản theo ID: ${req.params.userID}`) 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, 
                userMessage.serverError(`cập nhật tài khoản theo ID: ${req.params.userID}`)
            )
        );
    }
};

const deleteOne = async (req, res, next) => {
    try {
        await userService.deleteById(req.params.userID);
        return res.status(200).json({ 
            success: true, 
            message: userMessage.success(`xoá tài khoản theo ${req.params.userID}`) 
        });
    } catch (err) {
        next(err instanceof APIError? 
            err : new APIError(500, 
                userMessage.serverError(`xoá tài khoản theo ${req.params.userID}`)
            )
        );
    }
};

const deleteAll = async(_req, res, next) => {
    try {
        const count = await userService.deleteAll();
        return res.status(200).json({ 
            success: true, 
            message: userMessage.success(`xoá tất cả (${count}) tài khoản`) 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, 
                userMessage.serverError('xoá tất cả tài khoản')
            )
        );
    }
}

const disable = async (req, res, next) => {
    try {
        await userService.disable(req.params.userID);
        return res.status(200).json({ 
            success: true, 
            message: userMessage.success(`vô hiệu hóa tài khoản tại ID: ${req.params.userID}`) 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, 
                userMessage.serverError(`vô hiệu hóa tài khoản tại ID: ${req.params.userID}`)
            )
        );
    }
}

module.exports = {
    create,
    findAll,
    findOne,
    update,
    deleteOne,
    deleteAll,
    disable
};

