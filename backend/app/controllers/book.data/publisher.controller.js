const PublisherService = require('../../services/book.data/publisher.service');
const { publisherMessages, processMessages } = require('../../messages/vi.message');
const { asyncHandler } = require('../../utils/asyncHandler.util');  

const publisherService = new PublisherService();
const collName = publisherMessages.publisher; // The name of the collection


exports.create = asyncHandler(async (req, res) => {
    const payload = { ...req.body };

    const publisher = await publisherService.create(payload);
    return res.status(201).json({
        success: true,
        message: processMessages.success(`Tạo thông tin ${collName} mới`),
        data: publisher
    });
}, processMessages.serverError(`Tạo thông tin ${collName} mới`));


exports.findAll = asyncHandler(async (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : {};

    const publishers = await publisherService.findAll(filter, attSelection);
    return res.status(200).json({
        success: true,
        data: publishers
    });
}, processMessages.serverError(`Tìm tất cả ${collName}`));


exports.findById = asyncHandler(async (req, res) => {
    const _id = req.params.publisherId;
    const attSelection = { publisher: '' };

    const publisher = await publisherService.findById(_id, attSelection);
    return res.status(200).json({
        success: true,
        data: publisher
    });
}, processMessages.serverError(`Tìm thông tin ${collName} với ID`));


exports.updateBasicInfoById = asyncHandler(async (req, res) => {
    const _id = req.params.publisherId;
    const payload = { ...req.body };

    const result = await publisherService.updateBasicInfoById(_id, payload);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Cập nhật thông tin cơ bản của ${collName} theo ID`),
        data: result
    });
}, processMessages.serverError(`Cập nhật thông tin cơ bản của ${collName} theo ID`));


exports.deleteById = asyncHandler(async (req, res) => {
    const _id = req.params.publisherId;

    await publisherService.deleteById(_id);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá ${collName} theo ID`)
    });
}, processMessages.serverError(`Xoá ${collName} theo ID`));


exports.deleteAll = asyncHandler(async (_req, res) => {
    const deletedCount = await publisherService.deleteAll();
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá tất cả (${deletedCount}) ${collName}`)
    });
}, processMessages.serverError(`Xoá tất cả ${collName}`));
