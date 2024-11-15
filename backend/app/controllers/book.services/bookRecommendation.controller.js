const BookRecommendationService = require('../../services/book.services/bookRecommendation.service');
const { bookRecommendationMessages, processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');

const bookRecommendationService = new BookRecommendationService();
const collName = bookRecommendationMessages.bookRecommendation; // The name of the collection

exports.create = async (req, res, next) => {
    try {
        const payload = JSON.parse(req.body.text);
        payload.bookCoverImage = req.file.buffer;

        const bookRecommendation = await bookRecommendationService.create(payload);

        const attSelection = { bookRecommendation: '-bookCoverImage' };
        const result = await bookRecommendationService.findById(bookRecommendation._id, attSelection);

        return res.status(201).json({ 
            success: true, 
            message: processMessages.success(`Tạo thông tin ${collName} mới`),
            data: result
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
    const attSelection = { bookRecommendation: '' };

    try {
        const bookRecommendations = await bookRecommendationService.findAll(filter, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: bookRecommendations 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm tất cả ${collName} với truy vấn 
                                                                    ${JSON.stringify(query)}`.replace(/\s+/g, ' ')))
        );
    }
};


exports.findById = async (req, res, next) => {
    const _id = req.params.bookRecommendationId;
    const attSelection = { bookRecommendation: '' };
    
    try {
        const bookRecommendation = await bookRecommendationService.findById(_id, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: bookRecommendation 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm thông tin ${collName} với ID: ${_id}`))
        );
    }
};


exports.updateStatusById = async (req, res, next) => {
    const _id = req.params.bookRecommendationId;
    const { approvedBy, status } = req.body;

    try {
        const result = await bookRecommendationService.updateStatusById(_id, approvedBy, status);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Cập nhật trạng thái của 
                                            ${collName} theo ID: ${_id}`.replace(/\s+/g, ' ')),
            data: result
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`cập nhật trạng thái của 
                                                                ${collName} theo ID: ${_id}`.replace(/\s+/g, ' ')))
        );
    }
};


exports.deleteById = async (req, res, next) => {
    const _id = req.params.bookRecommendationId;

    try {
        await bookRecommendationService.deleteById(_id);
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
        const deletedCount = await bookRecommendationService.deleteAll();
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