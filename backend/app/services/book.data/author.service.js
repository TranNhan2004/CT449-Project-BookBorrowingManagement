const { Author } = require('../../models/book.data/author.model');
const { Book } = require('../../models/book.data/book.model');
const { authorMessages, bookMessages, processMessages } = require('../../messages/vi.message');
const { ApiError } = require('../../utils/error.util');
const { getValidatedId, isDefined } = require('../../utils/validationData.util');

class AuthorService {

    constructor() {
        this.authorModel = Author;
    }

    async extractAuthorData(payload) {
        const authorData = {
            name: payload.name,
            description: payload.description
        };

        Object.keys(authorData).forEach(
            (key) => !isDefined(authorData[key]) && delete authorData[key]
        );

        return authorData;
    }

    async create(payload) {
        if (!isDefined(payload.name)) {
            throw new ApiError(400, authorMessages.requiredName);
        }
        
        const authorData = await this.extractAuthorData(payload);
        return await this.authorModel.create(authorData);
    }

    async findAll(filter = {}, attSelection = {}) {
        return await this.authorModel.find(filter).select(attSelection.author || '');
    }   

    async findById(_id, attSelection = {}) {
        const validatedId = getValidatedId(_id);
        const author = await this.authorModel.findById(validatedId).select(attSelection.author || '');
        if (!author) {
            throw new ApiError(404, processMessages.notFound(authorMessages.author, { id: _id }));
        }
        return author;
    }

    async updateBasicInfoById(_id, payload) {
        const author = await this.findById(_id); 
        const updatedData = await this.extractAuthorData(payload);

        Object.assign(author, updatedData);
        return await author.save();  
    }
    
    async checkRefBeforeDelete(author) {
        const filter = { authors: author._id };
        if (await Book.exists(filter)) {
            throw new ApiError(400, processMessages.foreignKeyDeletionError(
                authorMessages.author,
                author.name,
                bookMessages.book
            ));
        }
        
        return true;
    }

    async deleteById(_id) {
        const attSelection = { author: '_id name'}
        const author = await this.findById(_id, attSelection);

        await this.checkRefBeforeDelete(author);
        
        const result = await this.authorModel.deleteOne({ _id: author._id });
        return result.deletedCount;
    }

    async deleteAll() {
        const attSelection = { author: '_id name' };
        const authors = await this.findAll({}, attSelection); 

        await Promise.all(authors.map(async (author) => await this.checkRefBeforeDelete(author)));
    
        const result = await this.authorModel.deleteMany({});    
        return result.deletedCount;
    }
    
}

module.exports = AuthorService;