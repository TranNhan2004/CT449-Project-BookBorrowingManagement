const express = require('express');
const cors = require('cors');
const app = express();

const staffRouter = require('./app/routes/book.accounts/staff.route');
const readerRouter = require('./app/routes/book.accounts/reader.route');

const authorRouter = require('./app/routes/book.data/author.route');
const publisherRouter = require('./app/routes/book.data/publisher.route');
const topicRouter = require('./app/routes/book.data/topic.route');
const bookRouter = require('./app/routes/book.data/book.route');
const bookItemRouter = require('./app/routes/book.data/bookItem.route');

const favoriteRouter = require('./app/routes/book.services/favorite.route');
const reviewRouter = require('./app/routes/book.services/review.route');
const bookRecommendationRouter = require('./app/routes/book.services/bookRecommendation.route');
const reservationRouter = require('./app/routes/book.services/reservation.route');
const bookBorrowingRouter = require('./app/routes/book.services/bookBorrowing.route');

app.use(cors());
app.use(express.json());

app.use('/api/staffs', staffRouter);
app.use('/api/readers', readerRouter);

app.use('/api/authors', authorRouter);
app.use('/api/publishers', publisherRouter);
app.use('/api/topics', topicRouter);
app.use('/api/books', bookRouter);
app.use('/api/book-items', bookItemRouter);

app.use('/api/favorites', favoriteRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/book-recommendations/', bookRecommendationRouter);
app.use('/api/reservations', reservationRouter);
app.use('/api/book-borrowings', bookBorrowingRouter);

app.use((err, _req, res, _next) => {
    console.log(err.stack);
    return res.status(err.statusCode).json({
        message: err.message
    });
})

module.exports = app;