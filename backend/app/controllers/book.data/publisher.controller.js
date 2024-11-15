const PublisherService = require('../../services/book.data/publisher.service');
const { publisherMessages, processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');

const publisherService = new PublisherService();
const collName = publisherMessages.publisher; // The name of the collection

exports.create = async (req, res, next) => {
    const payload = { ...req.body };

    try {
        const publisher = await publisherService.create(payload);
        return res.status(201).json({ 
            success: true, 
            message: processMessages.success(`Tạo thông tin ${collName} mới`),
            data: publisher 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tạo thông tin ${collName} mới`))
        );
    }
};

exports.findAll = async (req, res, next) => {
    const query = { ...req.query };
    const attSelection = { publisher: '' };

    try {
        const publishers = await publisherService.findAll(query, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: publishers 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm tất cả ${collName} với truy vấn 
                                                                    ${JSON.stringify(query)}`.replace(/\s+/g, ' ')))
        );
    }
};


exports.findById = async (req, res, next) => {
    const _id = req.params.publisherId;
    const attSelection = { publisher: '' };
    
    try {
        const publisher = await publisherService.findById(_id, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: publisher 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm thông tin ${collName} với ID: ${_id}`))
        );
    }
};

exports.updateBasicInfoById = async (req, res, next) => {
    const _id = req.params.publisherId;
    const payload = { ...req.body };

    try {
        const result = await publisherService.updateBasicInfoById(_id, payload);
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
    const _id = req.params.publisherId;

    try {
        await publisherService.deleteById(_id);
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
        const deletedCount = await publisherService.deleteAll();
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