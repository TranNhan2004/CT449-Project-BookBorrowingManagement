const userController = require('../../controllers/book.accounts/user.controller');

const express = require('express');
const router = express.Router();

router.route('/')
    .get(userController.findAll)
    .post(userController.create)
    .delete(userController.deleteAll);


router.route('/:userId')
    .get(userController.findById)
    .patch((req, res, next) =>
        req.body.action === 'disable' ? 
            userController.disable(req, res, next) :
            userController.update(req, res, next)
    )
    .delete(userController.deleteById);

module.exports = router;