const reservationController = require('../../controllers/book.services/reservation.controller');

const express = require('express');
const router = express.Router();

router.route('/')
    .get(reservationController.findAll)
    .post(reservationController.create)
    .delete(reservationController.deleteAll);


router.route('/:reservationId')
    .get(reservationController.findById)
    .delete(reservationController.deleteById);

router.route('/due-date/').patch(reservationController.checkDueDate);

module.exports = router;