const express = require('express');
const cors = require('cors');
const app = express();

const userRouter = require('./app/routes/book.accounts/user.route');


app.use(cors());
app.use(express.json());

app.use('/api/v1-1/users', userRouter);

module.exports = app;