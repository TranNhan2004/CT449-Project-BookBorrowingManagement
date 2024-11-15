const ReservationService = require('../../services/book.services/reservation.service');
const { reservationMessages, processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');

const reservationService = new ReservationService();
const collName = reservationMessages.reservation; // The name of the collection

exports.create = async (req, res, next) => {
    const payload = { ...req.body };

    try {
        const reservation = await reservationService.create(payload);
        return res.status(201).json({ 
            success: true, 
            message: processMessages.success(`Tạo thông tin ${collName} mới`),
            data: reservation 
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
    const attSelection = { reservation: '' };

    try {
        const reservations = await reservationService.findAll(filter, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: reservations 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm tất cả ${collName} với truy vấn 
                                                                    ${JSON.stringify(query)}`.replace(/\s+/g, ' ')))
        );
    }
};


exports.findById = async (req, res, next) => {
    const _id = req.params.reservationId;
    const attSelection = { reservation: '' };
    
    try {
        const reservation = await reservationService.findById(_id, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: reservation 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm thông tin ${collName} với ID: ${_id}`))
        );
    }
};

exports.findOne = async (req, res, next) => {
    const filter = { ...req.query };
    const attSelection = { reservation: '' };
    
    try {
        const reservation = await reservationService.findOne(filter, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: reservation 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm thông tin ${collName} với ID: ${_id}`))
        );
    }
};


exports.checkDueDate = async (req, res, next) => {
    const { reservedBy } = req.body;

    try {
        const result = await reservationService.checkDueDate(reservedBy);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Kiểm tra hết hạn của ${collName} 
                                            theo độc giả ${reservedBy}`.replace(/\s+/g, ' ')),
            data: result
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`Kiểm tra hết hạn của ${collName} 
                                                                theo độc giả ${reservedBy}`.replace(/\s+/g, ' ')))
        );
    }
};


exports.deleteById = async (req, res, next) => {
    const _id = req.params.reservationId;

    try {
        await reservationService.deleteById(_id);
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
        const deletedCount = await reservationService.deleteAll();
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