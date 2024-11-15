const staffController = require('../../controllers/book.accounts/staff.controller');

const express = require('express');
const router = express.Router();

router.route('/')
    .get(staffController.findAll)
    .post(staffController.create)
    .delete(staffController.deleteAll);


router.route('/:staffId')
    .get(staffController.findById)
    .patch(staffController.updateBasicInfoById)
    .delete(staffController.deleteById);


router.route('/phone/:staffId').patch(staffController.updatePhoneNumberById);

router.route('/email/:staffId').patch(staffController.updateEmailById);

router.route('/password/:staffId').patch(staffController.updatePasswordById);

router.route('/validation/:readerId').patch(staffController.updateValiationById);

module.exports = router;