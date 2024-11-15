const BookBorrowingService = require('../../services/book.services/bookBorrowing.service');
const { bookBorrowingMessages, processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');

const bookBorrowingService = new BookBorrowingService();
const collName = bookBorrowingMessages.bookBorrowing; // The name of the collection

exports.create = async (req, res, next) => {
    const payload = { ...req.body };

    try {
        const bookBorrowing = await bookBorrowingService.create(payload);
        return res.status(201).json({ 
            success: true, 
            message: processMessages.success(`Tạo thông tin ${collName} mới`),
            data: bookBorrowing 
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
    const attSelection = { bookBorrowing: '' };

    try {
        const bookBorrowings = await bookBorrowingService.findAll(filter, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: bookBorrowings 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm tất cả ${collName} với truy vấn 
                                                                    ${JSON.stringify(query)}`.replace(/\s+/g, ' ')))
        );
    }
};

exports.findById = async (req, res, next) => {
    const _id = req.params.bookBorrowingId;
    const attSelection = { bookBorrowing: '' };
    
    try {
        const bookBorrowing = await bookBorrowingService.findById(_id, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: bookBorrowing 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm thông tin ${collName} với ID: ${_id}`))
        );
    }
};

exports.returnBookItemById = async (req, res, next) => {
    const _id = req.params.bookBorrowingId;

    try {
        const result = await bookBorrowingService.returnBookItemById(_id);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Trả bản sao sách theo 
                                            ${collName} với ID: ${_id}`.replace(/\s+/g, ' ')),
            data: result
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(err.message))
        );
        // `trả bản sao sách theo ${collName} với ID: ${_id}`.replace(/\s+/g, ' ')
    }
};

exports.extendDueDateById = async (req, res, next) => {
    const _id = req.params.bookBorrowingId;

    try {
        const result = await bookBorrowingService.extendDueDateById(_id);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Gia hạn mượn sách của
                                            ${collName} với ID: ${_id}`.replace(/\s+/g, ' ')),
            data: result
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`gia hạn mượn sách
                                                                ${collName} với ID: ${_id}`.replace(/\s+/g, ' ')))
        );
    }
};

exports.checkDueDate = async (req, res, next) => {
    const { borrowedBy } = req.body;

    try {
        const result = await bookBorrowingService.checkDueDate(borrowedBy);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Kiểm tra hết hạn của ${collName} 
                                            theo độc giả ${borrowedBy}`.replace(/\s+/g, ' ')),
            data: result
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`Kiểm tra hết hạn của ${collName} 
                                                                theo độc giả ${borrowedBy}`.replace(/\s+/g, ' ')))
        );
    }
};

exports.deleteById = async (req, res, next) => {
    const _id = req.params.bookBorrowingId;

    try {
        await bookBorrowingService.deleteById(_id);
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
        const deletedCount = await bookBorrowingService.deleteAll();
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