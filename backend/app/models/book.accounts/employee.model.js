const mongoose = require('mongoose');

const EmployeeSchema = mongoose.Schema({
    employeeID: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    jobTitle: {
        type: String,
        enum: ['Quản lý Dịch vụ', 'Quản lý Sách'],
        required: true,
    }

});

const Employee = mongoose.model('Employee', EmployeeSchema);
module.exports = Employee;