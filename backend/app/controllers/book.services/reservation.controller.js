const ReservationService = require('../../services/book.services/reservation.service');
const { reservationMessages, processMessages } = require('../../messages/vi.message');
const { asyncHandler } = require('../../utils/asyncHandler.util');  

const reservationService = new ReservationService();
const collName = reservationMessages.reservation; // The name of the collection

exports.create = asyncHandler(async (req, res) => {
    const payload = { ...req.body };

    const reservation = await reservationService.create(payload);
    const attSelection = { reservation: '-bookCoverImage' };
    const result = await reservationService.findById(reservation._id, attSelection);

    return res.status(201).json({
        success: true,
        message: processMessages.success(`Tạo thông tin ${collName} mới`),
        data: result
    });
}, processMessages.serverError(`Tạo thông tin ${collName} mới`));


exports.findAll = asyncHandler(async (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : {};

    const reservations = await reservationService.findAll(filter, attSelection);
    return res.status(200).json({
        success: true,
        data: reservations
    });
}, processMessages.serverError(`Tìm tất cả ${collName} với truy vấn`));


exports.findById = asyncHandler(async (req, res) => {
    const _id = req.params.reservationId;
    const attSelection = { reservation: '' };

    const reservation = await reservationService.findById(_id, attSelection);
    return res.status(200).json({
        success: true,
        data: reservation
    });
}, processMessages.serverError(`Tìm thông tin ${collName} với ID`));


exports.findOne = asyncHandler(async (req, res) => {
    const filter = { ...req.query };
    const attSelection = { reservation: '' };

    const reservation = await reservationService.findOne(filter, attSelection);
    return res.status(200).json({
        success: true,
        data: reservation
    });
}, processMessages.serverError(`Tìm thông tin ${collName} với truy vấn`));


exports.checkDueDate = asyncHandler(async (req, res) => {
    const { reservedBy } = req.body;

    const result = await reservationService.checkDueDate(reservedBy);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Kiểm tra hết hạn của ${collName} theo độc giả`),
        data: result
    });
}, processMessages.serverError(`Kiểm tra hết hạn của ${collName} theo độc giả`));


exports.deleteById = asyncHandler(async (req, res) => {
    const _id = req.params.reservationId;

    await reservationService.deleteById(_id);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá ${collName} theo ID`)
    });
}, processMessages.serverError(`Xoá ${collName} theo ID`));


exports.deleteAll = asyncHandler(async (_req, res) => {
    const deletedCount = await reservationService.deleteAll();
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá tất cả (${deletedCount}) ${collName}`)
    });
}, processMessages.serverError(`Xoá tất cả ${collName}`));
