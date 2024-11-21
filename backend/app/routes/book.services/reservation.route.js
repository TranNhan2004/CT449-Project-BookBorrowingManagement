const authController = require('../../controllers/book.accounts/auth.controller');
const reservationController = require('../../controllers/book.services/reservation.controller');

const express = require('express');
const router = express.Router();

router.use(authController.protect);

router.route('/')
    .get(reservationController.findAll)
    .post(authController.restrictToReader(), reservationController.create)

router.route('/:reservationId')
    .get(reservationController.findById)
    .delete(reservationController.deleteById);

    
module.exports = router;