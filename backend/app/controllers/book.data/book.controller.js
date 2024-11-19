const BookService = require('../../services/book.data/book.service');
const StaffService = require('../../services/book.accounts/staff.service');
const { bookMessages, processMessages } = require('../../messages/vi.message');
const { asyncHandler } = require('../../utils/asyncHandler.util');  

const bookService = new BookService();
const staffService = new StaffService();
const collName = bookMessages.book; // The name of the collection


exports.create = asyncHandler(async (req, res) => {
    const payload = { ...req.body }; 
    console.log(payload);
    payload.image = req.file?.buffer;
    payload.addedBy = req.specificUser._id;
    payload.authors = payload.authors.split(',');
    payload.topics = payload.topics.split(',');

    const book = await bookService.create(payload);
    return res.status(201).json({
        success: true,
        message: processMessages.success(`Tạo thông tin ${collName} mới`),
        data: book
    });
}, processMessages.serverError(`Tạo thông tin ${collName} mới`));


exports.findAll = asyncHandler(async (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : {};

    const books = await bookService.findAll(filter, attSelection);

    const processedBooks = books.map((book) => {
        let bookCopy = book.toObject();
        bookCopy.imageBase64 = `data:image/png;base64,${book.image.toString('base64')}`;
        delete bookCopy.image;
        return bookCopy;
    });

    if (processedBooks.length > 0 && Object.hasOwn(attSelection, 'addedBy')) {
        const staffAttSelection = { staff: '_id user', user: '-_id surname name' };
        const staffList = await Promise.all(processedBooks.map(async (processedBook) =>
            await staffService.findById(processedBook.addedBy, staffAttSelection)
        ));

        processedBooks.forEach((book, index) => {
            book.addedBy.user = staffList[index];
        });
    }

    return res.status(200).json({
        success: true,
        data: processedBooks
    });
}, processMessages.serverError(`Tìm tất cả ${collName}`));


exports.findById = asyncHandler(async (req, res) => {
    const _id = req.params.bookId;
    const attSelection = req.query.projection ? JSON.parse(req.query.projection) : {};

    const book = await bookService.findById(_id, attSelection);

    const processedBook = book.toObject();
    processedBook.imageBase64 = `data:image/png;base64,${book.image.toString('base64')}`;
    delete processedBook.image;

    if (Object.hasOwn(processedBook, 'addedBy')) {
        const staffAttSelection = { staff: '_id user', user: '-_id surname name' };
        processedBook.addedBy = await staffService.findById(processedBook.addedBy, staffAttSelection);
    }

    return res.status(200).json({
        success: true,
        data: processedBook
    });
}, processMessages.serverError(`Tìm thông tin ${collName} bằng ID`));


exports.updateBasicInfoById = asyncHandler(async (req, res) => {
    const _id = req.params.bookId;
    const payload = { ...req.body }; 
    console.log(payload);
    payload.image = req.file?.buffer;
    payload.addedBy = req.specificUser?._id;
    payload.authors = payload.authors?.split(',');
    payload.topics = payload.topics?.split(',');
    
    await bookService.updateBasicInfoById(_id, payload);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Cập nhật thông tin cơ bản của ${collName} theo ID`),
        data: ''
    });
}, processMessages.serverError(`Cập nhật thông tin cơ bản của ${collName} theo ID`));



exports.deleteById = asyncHandler(async (req, res) => {
    const _id = req.params.bookId;

    await bookService.deleteById(_id);
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá ${collName} theo ID`)
    });
}, processMessages.serverError(`Xoá ${collName} theo ID`));

exports.deleteAll = asyncHandler(async (_req, res) => {
    const deletedCount = await bookService.deleteAll();
    return res.status(200).json({
        success: true,
        message: processMessages.success(`Xoá tất cả (${deletedCount}) ${collName}`)
    });
}, processMessages.serverError(`Xoá tất cả ${collName}`));
