const AuthorService = require('../../services/book.data/author.service');
const { authorMessages, processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');

const authorService = new AuthorService();
const collName = authorMessages.author; // The name of the collection

exports.create = async (req, res, next) => {
    const payload = { ...req.body };

    try {
        const author = await authorService.create(payload);
        return res.status(201).json({ 
            success: true, 
            message: processMessages.success(`Tạo thông tin ${collName} mới`),
            data: author 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tạo thông tin ${collName} mới`))
        );
    }
};

exports.findAll = async (req, res, next) => {
    const query = { ...req.query };
    const attSelection = { author: '' };

    try {
        const authors = await authorService.findAll(query, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: authors 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm tất cả ${collName} với truy vấn 
                                                                    ${JSON.stringify(query)}`.replace(/\s+/g, ' ')))
        );
    }
};


exports.findById = async (req, res, next) => {
    const _id = req.params.authorId;
    const attSelection = { author: '' };
    
    try {
        const author = await authorService.findById(_id, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: author 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm thông tin ${collName} với ID: ${_id}`))
        );
    }
};

exports.updateBasicInfoById = async (req, res, next) => {
    const _id = req.params.authorId;
    const payload = { ...req.body };

    try {
        const result = await authorService.updateBasicInfoById(_id, payload);
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

exports.deleteById = async (req, res, next) => {
    const _id = req.params.authorId;

    try {
        await authorService.deleteById(_id);
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
        const deletedCount = await authorService.deleteAll();
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