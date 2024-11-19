const authController = require('../../controllers/book.accounts/auth.controller');
const staffController = require('../../controllers/book.accounts/staff.controller');

const express = require('express');
const router = express.Router();

router.use(authController.protect);

router.use(authController.restrictToStaff());
router.route('/:staffId')
    .get(staffController.findById)
    .patch(staffController.updateBasicInfoById);
router.route('/password/:staffId').patch(staffController.updatePasswordById);


router.route('/').get(authController.restrictToStaff(['admin']), staffController.findAll)

module.exports = router;