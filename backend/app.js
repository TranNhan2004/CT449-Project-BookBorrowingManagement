const express = require('express');
const cors = require('cors');
const app = express();

const userRouter = require('./app/routes/book.accounts/user.route');
const staffRouter = require('./app/routes/book.accounts/staff.route');


app.use(cors());
app.use(express.json());

app.use('/api/v1-1/users', userRouter);
app.use('/api/v1-1/staffs', staffRouter);

module.exports = app;