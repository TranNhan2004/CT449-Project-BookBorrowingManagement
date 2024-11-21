const express = require('express');
const cors = require('cors');
const app = express();

const cookieParser = require('cookie-parser');

const authRouter = require('./app/routes/book.accounts/auth.route');

const staffRouter = require('./app/routes/book.accounts/staff.route');
const readerRouter = require('./app/routes/book.accounts/reader.route');

const authorRouter = require('./app/routes/book.data/author.route');
const publisherRouter = require('./app/routes/book.data/publisher.route');
const topicRouter = require('./app/routes/book.data/topic.route');
const bookRouter = require('./app/routes/book.data/book.route');
const bookItemRouter = require('./app/routes/book.data/bookItem.route');

const favoriteRouter = require('./app/routes/book.services/favorite.route');
const reviewRouter = require('./app/routes/book.services/review.route');
const reservationRouter = require('./app/routes/book.services/reservation.route');
const bookBorrowingRouter = require('./app/routes/book.services/bookBorrowing.route');

const { errorHandler } = require('./app/utils/error.util');


app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

app.use('/api/staffs', staffRouter);
app.use('/api/readers', readerRouter);

app.use('/api/authors', authorRouter);
app.use('/api/publishers', publisherRouter);
app.use('/api/topics', topicRouter);
app.use('/api/books', bookRouter);
app.use('/api/book-items', bookItemRouter);

app.use('/api/favorites', favoriteRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/reservations', reservationRouter);
app.use('/api/book-borrowings', bookBorrowingRouter);

app.use(errorHandler);

module.exports = app;