const authController = require('../../controllers/book.accounts/auth.controller');
const staffController = require('../../controllers/book.accounts/staff.controller');

const express = require('express');
const router = express.Router();

router.use(authController.protect);

router.route('/me').get(staffController.getMe);
router.route('/me/update').patch(staffController.updateMe);
router.route('/me/change-password').patch(staffController.changeMyPassword);

router.route('/:staffId')
    .get(staffController.findById)
    .patch(staffController.updateBasicInfoById);


router.use(authController.restrictToStaff(['admin']));

router.route('/').get(staffController.findAll)
router.route('/:staffId').delete(staffController.deleteById);
router.route('/validation/:staffId').patch(staffController.updateValidationById);



module.exports = router;