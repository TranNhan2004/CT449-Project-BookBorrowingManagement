const BookItemService = require('../../services/book.data/bookItem.service');
const { bookItemMessages, processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');

const bookItemService = new BookItemService();
const collName = bookItemMessages.bookItem; // The name of the collection

exports.create = async (req, res, next) => {
    const payload = { ...req.body };

    try {
        const bookItem = await bookItemService.create(payload);
        return res.status(201).json({ 
            success: true, 
            message: processMessages.success(`Tạo thông tin ${collName} mới`),
            data: bookItem 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tạo thông tin ${collName} mới`))
        );
    }
};

exports.findAll = async (req, res, next) => {
    const query = { ...req.query };
    const attSelection = { bookItem: '' };

    try {
        const bookItems = await bookItemService.findAll(query, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: bookItems 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm tất cả ${collName} với truy vấn 
                                                                    ${JSON.stringify(query)}`.replace(/\s+/g, ' ')))
        );
    }
};


exports.findById = async (req, res, next) => {
    const _id = req.params.bookItemId;
    const attSelection = { bookItem: '' };
    
    try {
        const bookItem = await bookItemService.findById(_id, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: bookItem 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm thông tin ${collName} với ID: ${_id}`))
        );
    }
};

exports.updateStatusById = async (req, res, next) => {
    const _id = req.params.bookItemId;
    const { status } = req.body;

    try {
        const result = await bookItemService.updateStatusById(_id, status);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Cập nhật trạng thái của
                                                ${collName} theo ID: ${_id}`.replace(/\s+/g, ' ')),
            data: result
        });
    } catch (err) {
        next(err instanceof APIError? 
            err : new APIError(500, processMessages.serverError(`cập nhật trạng thái của
                                                                    ${collName} theo ID: ${_id}`.replace(/\s+/g, ' ')))
        );
    }
}

exports.deleteById = async (req, res, next) => {
    const _id = req.params.bookItemId;

    try {
        await bookItemService.deleteById(_id);
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
        const deletedCount = await bookItemService.deleteAll();
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