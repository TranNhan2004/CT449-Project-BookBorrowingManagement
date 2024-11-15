const FavoriteService = require('../../services/book.services/favorite.service');
const { favoriteMessages, processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');

const favoriteService = new FavoriteService();
const collName = favoriteMessages.favorite; // The name of the collection

exports.create = async (req, res, next) => {
    const payload = { ...req.body };

    try {
        const favorite = await favoriteService.create(payload);
        return res.status(201).json({ 
            success: true, 
            message: processMessages.success(`Tạo thông tin ${collName} mới`),
            data: favorite 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(err.message))
        );
    }
};

exports.findAll = async (req, res, next) => {
    const filter = { ...req.query };
    const attSelection = { favorite: '' };

    try {
        const favorites = await favoriteService.findAll(filter, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: favorites 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm tất cả ${collName} với truy vấn 
                                                                    ${JSON.stringify(query)}`.replace(/\s+/g, ' ')))
        );
    }
};


exports.findById = async (req, res, next) => {
    const _id = req.params.favoriteId;
    const attSelection = { favorite: '' };
    
    try {
        const favorite = await favoriteService.findById(_id, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: favorite 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm thông tin ${collName} với ID: ${_id}`))
        );
    }
};

exports.deleteById = async (req, res, next) => {
    const _id = req.params.favoriteId;

    try {
        await favoriteService.deleteById(_id);
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
        const deletedCount = await favoriteService.deleteAll();
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