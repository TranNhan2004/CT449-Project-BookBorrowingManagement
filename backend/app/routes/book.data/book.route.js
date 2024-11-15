const bookController = require('../../controllers/book.data/book.controller');

const express = require('express');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.route('/')
    .get(bookController.findAll)
    .post(upload.single('file'), bookController.create)
    .delete(bookController.deleteAll);


router.route('/:bookId')
    .get(bookController.findById)
    .patch(bookController.updateBasicInfoById)
    .delete(bookController.deleteById);


module.exports = router;