const ReaderService = require('../../services/book.accounts/reader.service');
const { readerMessages, processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');

const readerService = new ReaderService();
const collName = readerMessages.reader; // The name of the collection

exports.create = async (req, res, next) => {
    const payload = { ...req.body };

    try {
        const reader = await readerService.create(payload);
        return res.status(201).json({ 
            success: true, 
            message: processMessages.success(`Tạo thông tin ${collName} mới`),
            data: reader 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(err.message))
        );
        // `tạo thông tin ${collName} mới`
    }
};

exports.findAll = async (req, res, next) => {
    const filter = { ...req.query };
    const attSelection = { reader: '', user: '-_id -password' };

    try {
        const readers = await readerService.findAll(filter, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: readers 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm tất cả ${collName} với truy vấn 
                                                                ${JSON.stringify(filter)}`.replace(/\s+/g, ' ')))
        );
    }
};


exports.findById = async (req, res, next) => {
    const _id = req.params.readerId;
    const attSelection = { reader: '' };
    
    try {
        const reader = await readerService.findById(_id, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: reader 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm thông tin ${collName} với ID: ${_id}`))
        );
    }
};

exports.updateBasicInfoById = async (req, res, next) => {
    const _id = req.params.readerId;
    const payload = { ...req.body };

    try {
        const result = await readerService.updateBasicInfoById(_id, payload);
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
    const _id = req.params.readerId;
    const { newPhoneNumber } = req.body;

    try {
        const result = await readerService.updatePhoneNumberById(_id, newPhoneNumber);
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
    const _id = req.params.readerId;
    const { newEmail } = req.body;

    try {
        const result = await readerService.updateEmailById(_id, newEmail);
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
    const _id = req.params.readerId;
    const { oldPassword, newPassword } = req.body;

    try {
        const result = await readerService.updatePasswordById(_id, oldPassword, newPassword);
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

exports.updatePointById = async (req, res, next) => {
    const _id = req.params.readerId;
    const { pointChanges } = req.body;

    try {
        const result = await readerService.updatePointById(_id, pointChanges);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Cập nhật thông tin điểm và cấp bậc của ${collName} theo ID: ${_id}`),
            data: result
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`cập nhật thông tin điểm và cấp bậc của 
                                                                ${collName} theo ID: ${_id}`).replace(/\s+/g, ' '))
        );
    }
}

exports.updateValiationById = async (req, res, next) => {
    const _id = req.params.readerId;
    const { isValid } = req.body;

    try {
        const result = await readerService.updateValidationById(_id, isValid);
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
    const _id = req.params.readerId;

    try {
        await readerService.deleteById(_id);
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
        const deletedCount = await readerService.deleteAll();
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



