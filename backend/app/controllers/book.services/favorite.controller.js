const FavoriteService = require('../../services/book.services/favorite.service');
const { favoriteMessages, processMessages } = require('../../messages/vi.message');
const { asyncHandler } = require('../../utils/asyncHandler.util');  

const favoriteService = new FavoriteService();
const collName = favoriteMessages.favorite; // The name of the collection

exports.create = asyncHandler(async (req, res) => {
    const payload = { ...req.body };

    const favorite = await favoriteService.create(payload);
    return res.status(201).json({
        success: true,
        message: processMessages.success(`Tạo thông tin ${collName} mới`),
        data: favorite
    });
}, processMessages.serverError(`Tạo thông tin ${collName} mới`));


exports.findAll = asyncHandler(async (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : {};

    const favorites = await favoriteService.findAll(filter, attSelection);
    return res.status(200).json({
        success: true,
        data: favorites
    });
}, processMessages.serverError(`Tìm tất cả ${collName}`));


exports.findById = asyncHandler(async (req, res) => {
    const _id = req.params.favoriteId;
    const attSelection = { favorite: '' };

    const favorite = await favoriteService.findById(_id, attSelection);
    return res.status(200).json({
        success: true,
        data: favorite
    });
}, processMessages.serverError(`Tìm thông tin ${collName} với ID`));


exports.deleteById = asyncHandler(async (req, res) => {
    const _id = req.params.favoriteId;

    await favoriteService.deleteById(_id);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá ${collName} theo ID`)
    });
}, processMessages.serverError(`Xoá ${collName} theo ID`));


exports.deleteAll = asyncHandler(async (_req, res) => {
    const deletedCount = await favoriteService.deleteAll();
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá tất cả (${deletedCount}) ${collName}`)
    });
}, processMessages.serverError(`Xoá tất cả ${collName}`));
