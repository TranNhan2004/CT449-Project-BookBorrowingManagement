const TopicService = require('../../services/book.data/topic.service');
const { topicMessages, processMessages } = require('../../messages/vi.message');
const { asyncHandler } = require('../../utils/asyncHandler.util');  

const topicService = new TopicService();
const collName = topicMessages.topic; // The name of the collection


exports.create = asyncHandler(async (req, res) => {
    const payload = { ...req.body };

    const topic = await topicService.create(payload);
    return res.status(201).json({
        success: true,
        message: processMessages.success(`Tạo thông tin ${collName} mới`),
        data: topic
    });
}, processMessages.serverError(`tạo thông tin ${collName} mới`));


exports.findAll = asyncHandler(async (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : {};

    const topics = await topicService.findAll(filter, attSelection);
    return res.status(200).json({
        success: true,
        data: topics
    });
}, processMessages.serverError(`tìm tất cả ${collName} với truy vấn`));


exports.findById = asyncHandler(async (req, res) => {
    const _id = req.params.topicId;
    const attSelection = { topic: '' };

    const topic = await topicService.findById(_id, attSelection);
    return res.status(200).json({
        success: true,
        data: topic
    });
}, processMessages.serverError(`tìm thông tin ${collName} với ID`));


exports.deleteById = asyncHandler(async (req, res) => {
    const _id = req.params.topicId;

    await topicService.deleteById(_id);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá ${collName} theo ID: ${_id}`)
    });
}, processMessages.serverError(`xoá ${collName} theo ID`));


exports.deleteAll = asyncHandler(async (_req, res) => {
    const deletedCount = await topicService.deleteAll();
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá tất cả (${deletedCount}) ${collName}`)
    });
}, processMessages.serverError(`xoá tất cả ${collName}`));
