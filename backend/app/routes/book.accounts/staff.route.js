const staffController = require('../../controllers/book.accounts/staff.controller');

const express = require('express');
const router = express.Router();

router.route('/')
    .get(staffController.findAll)
    .post(staffController.create)
    .delete(staffController.deleteAll);


router.route('/:staffId')
    .get(staffController.findById)
    .patch((req, res, next) =>
        req.body.action === 'disable' ? 
            staffController.disable(req, res, next) :
            staffController.update(req, res, next)
    )
    .delete(staffController.deleteById);

module.exports = router;