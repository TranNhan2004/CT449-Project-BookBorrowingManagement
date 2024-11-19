const authController = require('../../controllers/book.accounts/auth.controller');
const bookController = require('../../controllers/book.data/book.controller');

const express = require('express');
const router = express.Router();

const { upload } = require('../../utils/uploadImage.util');


router.use(authController.protect);

router.route('/')
    .get(bookController.findAll);

router.route('/:bookId')
    .get(bookController.findById);


router.use(authController.restrictToStaff(['admin']));
router.route('/')
    .post(upload.single('image'), bookController.create);

router.route('/:bookId')
    .patch(upload.single('image'), bookController.updateBasicInfoById)
    .delete(bookController.deleteById);

module.exports = router;