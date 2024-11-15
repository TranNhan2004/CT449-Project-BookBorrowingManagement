const BookService = require('../../services/book.data/book.service');
const UserService = require('../../services/book.accounts/user.service');
const { bookMessages, processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');

const bookService = new BookService();
const userService = new UserService();
const collName = bookMessages.book; // The name of the collection

exports.create = async (req, res, next) => {
    try {
        const payload = JSON.parse(req.body.text);
        payload.image = req.file.buffer;
        
        const book = await bookService.create(payload);
        return res.status(201).json({ 
            success: true, 
            message: processMessages.success(`Tạo thông tin ${collName} mới`),
            data: book 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tạo thông tin ${collName} mới`))
        );
    }
};

exports.findAll = async (req, res, next) => {
    const query = { ...req.query };
    const attSelection = {
        book: '-image',
        authors: '-_id name description',
        publisher: '-_id name description',
        topics: '-_id name',
        addedBy: '-_id user'
    };

    try {
        const books = await bookService.findAll(query, attSelection);
        const userIds = books.map(book => book.addedBy.user);
        const userAttSelection = { user: '-_id surname name' };
        const userList = await Promise.all(userIds.map(id => 
                userService.findByIdForUser(id, userAttSelection)
            )
        );

        // Gán thông tin vào sách
        books.forEach((book, index) => {
            book.addedBy = userList[index];
        });

        return res.status(200).json({ 
            success: true, 
            data: books 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm tất cả ${collName} với truy vấn 
                                                                    ${JSON.stringify(query)}`.replace(/\s+/g, ' ')))
        );
    }
};

exports.findById = async (req, res, next) => {
    const _id = req.params.bookId;
    const attSelection = { book: '' };
    
    try {
        const book = await bookService.findById(_id, attSelection);
        return res.status(200).json({ 
            success: true, 
            data: book 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`tìm thông tin ${collName} với ID: ${_id}`))
        );
    }
};

exports.updateBasicInfoById = async (req, res, next) => {
    const _id = req.params.bookId;
    const payload = { ...req.body };

    try {
        const result = await bookService.updateBasicInfoById(_id, payload);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Cập nhật thông tin cơ bản của ${collName} theo ID: ${_id}`),
            data: result
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`cập nhật thông tin cơ bản của
                                                                ${collName} theo ID: ${_id}`.replace(/\s+/g, ' ')))
        );
    }
};


exports.deleteById = async (req, res, next) => {
    const _id = req.params.bookId;

    try {
        await bookService.deleteById(_id);
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Xoá ${collName} theo ID: ${_id}`) 
        });
    } catch (err) {
        next(err instanceof APIError? 
            err : new APIError(500, processMessages.serverError(`xoá ${collName} theo ID: ${_id}`))
        );
    }
};

exports.deleteAll = async(_req, res, next) => {
    try {
        const deletedCount = await bookService.deleteAll();
        return res.status(200).json({ 
            success: true, 
            message: processMessages.success(`Xoá tất cả (${deletedCount}) ${collName}`) 
        });
    } catch (err) {
        next(err instanceof APIError ? 
            err : new APIError(500, processMessages.serverError(`xoá tất cả ${collName}`))
        );
    }
}
