const { Publisher } = require('../../models/book.data/publisher.model');
const { Book } = require('../../models/book.data/book.model');
const { publisherMessages, bookMessages, processMessages } = require('../../messages/vi.message');
const { ApiError } = require('../../utils/error.util');
const { getValidatedId, isDefined } = require('../../utils/validation.util'); 

class PublisherService {

    constructor() {
        this.publisherModel = Publisher;
    }

    async extractPublisherData(payload) {
        const publisherData = {
            name: payload.name,
            description: payload.description
        };

        Object.keys(publisherData).forEach(
            (key) => !isDefined(publisherData[key]) && delete publisherData[key]
        );

        return publisherData;
    }

    async create(payload) {        
        if (!isDefined(payload.name)) {
            throw new ApiError(400, publisherMessages.requiredName);
        }

        const publisherData = await this.extractPublisherData(payload);
        return await this.publisherModel.create(publisherData);
    }

    async findAll(filter = {}, attSelection = {}) {
        return await this.publisherModel.find(filter).select(attSelection.publisher || '');
    }   

    async findById(_id, attSelection = {}) {
        const validatedId = getValidatedId(_id);
        const publisher = await this.publisherModel.findById(validatedId).select(attSelection.publisher || '');
        if (!publisher) {
            throw new ApiError(404, processMessages.notFound(publisherMessages.publisher, { id: _id }));
        }
        return publisher;
    }

    async updateBasicInfoById(_id, payload) {    
        const publisher = await this.findById(_id);
        const updatedData = await this.extractPublisherData(payload);

        Object.assign(publisher, updatedData);
        return await publisher.save();
    }
    
    async checkRefBeforeDelete(publisher) {
        const filter = { publisher: publisher._id };
        if (await Book.exists(filter)) {
            throw new ApiError(400, processMessages.foreignKeyDeletionError(
                publisherMessages.publisher,
                publisher.name,
                bookMessages.book
            ));
        }
        
        return true;
    }

    async deleteById(_id) {
        const attSelection = { publisher: '_id name' };
        const publisher = await this.findById(_id, attSelection);
        
        await this.checkRefBeforeDelete(publisher);
        
        const result = await this.publisherModel.deleteOne({ _id: publisher._id });
        return result.deletedCount;
    }

    async deleteAll() {
        const attSelection = { publisher: '_id name' };
        const publishers = await this.findAll({}, attSelection);
        
        await Promise.all(publishers.map(async (publisher) => await this.checkRefBeforeDelete(publisher)));
        
        const result = await this.publisherModel.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = PublisherService;