const authController = require('../../controllers/book.accounts/auth.controller');
const authorController = require('../../controllers/book.data/author.controller');

const express = require('express');
const router = express.Router();

router.use(authController.protect);

router.route('/').get(authorController.findAll);
router.route('/:authorId').get(authorController.findById);

router.use(authController.restrictToStaff(['admin']));
router.route('/')
    .post(authorController.create)
    .delete(authorController.deleteAll);

router.route('/:authorId')
    .patch(authorController.updateBasicInfoById)
    .delete(authorController.deleteById);

module.exports = router;