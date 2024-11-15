const { Author, authorConfig } = require('../../models/book.data/author.model');
const { Book } = require('../../models/book.data/book.model');
const { authorMessages, bookMessages, processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');
const { getValidatedId, isDefined } = require('../../utils/validation.util');

class AuthorService {

    constructor() {
        this.authorModel = Author;
        this.authorConfig = authorConfig;
    }

    async extractAuthorData(payload) {
        const authorData = {
            publicId: payload.publicId,
            name: payload.name,
            description: payload.description
        }

        Object.keys(authorData).forEach(
            (key) => !isDefined(authorData[key]) && delete authorData[key]
        );

        return authorData;
    }

    async create(payload) {
        if (!isDefined(payload.publicId)) {
            throw new APIError(400, authorMessages.requiredPublicId);
        }
        if (!isDefined(payload.name)) {
            throw new APIError(400, authorMessages.requiredName);
        }

        if (!this.authorConfig.publicIdPattern.test(payload.publicId)) {
            throw new APIError(400, authorMessages.invalidPublicId);
        }

        const existingAuthor = await this.authorModel.findOne({ publicId: payload.publicId });
        if (existingAuthor) {
            throw new APIError(409, authorMessages.existedPublicId);
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
            throw new APIError(404, processMessages.notFound(authorMessages.author, { id: _id }));
        }
        return author;
    }

    async updateBasicInfoById(_id, payload) {
        delete payload.publicId;  

        const author = await this.findById(_id); 
        const updatedData = await this.extractAuthorData(payload);  
    
        Object.assign(author, updatedData);
        return await author.save();  
    }
    
    async checkRefBeforeDelete(author) {
        const filter = { authors: author._id };
        if (await Book.exists(filter)) {
            throw new APIError(400, processMessages.foreignKeyDeletionError(
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