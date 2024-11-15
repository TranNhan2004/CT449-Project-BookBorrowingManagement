const TopicService = require('../../services/book.data/topic.service');
const { topicMessages, processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');

const topicService = new TopicService();
const collName = topicMessages.topic; // The name of the collection

exports.create = async (req, res, next) => {
    const payload = { ...req.body };

    try {
        const topic = await topicService.create(payload);
        return res.status(201).json({ 
            success: true, 
            message: processMessages.success(`Tạo thông tin ${collName} mới`),
            data: topic 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tạo thông tin ${collName} mới`))
        );
    }
};

exports.findAll = async (req, res, next) => {
    const query = { ...req.query };
    const attSelection = { topic: '' };

    try {
        const topics = await topicService.findAll(query, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: topics 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm tất cả ${collName} với truy vấn 
                                                                    ${JSON.stringify(query)}`.replace(/\s+/g, ' ')))
        );
    }
};


exports.findById = async (req, res, next) => {
    const _id = req.params.topicId;
    const attSelection = { topic: '' };
    
    try {
        const topic = await topicService.findById(_id, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: topic 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm thông tin ${collName} với ID: ${_id}`))
        );
    }
};

exports.deleteById = async (req, res, next) => {
    const _id = req.params.topicId;

    try {
        await topicService.deleteById(_id);
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
        const deletedCount = await topicService.deleteAll();
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