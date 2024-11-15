const { Publisher, publisherConfig } = require('../../models/book.data/publisher.model');
const { Book } = require('../../models/book.data/book.model');
const { publisherMessages, bookMessages, processMessages } = require('../../messages/vi.message');
const { APIError } = require('../../utils/error.util');
const { getValidatedId, isDefined } = require('../../utils/validation.util'); 

class PublisherService {

    constructor() {
        this.publisherModel = Publisher;
        this.publisherConfig = publisherConfig;
    }

    async extractPublisherData(payload) {
        const publisherData = {
            publicId: payload.publicId,
            name: payload.name,
            description: payload.description
        }

        Object.keys(publisherData).forEach(
            (key) => !isDefined(publisherData[key]) && delete publisherData[key]
        );
        
        return publisherData;
    }

    async create(payload) {
        const publisherData = { 
            publicId: payload.publicId,
            name: payload.name,
            description: payload.description
        };

        if (!isDefined(publisherData.publicId)) {
            throw new APIError(400, publisherMessages.requiredPublicId);
        }
        if (!isDefined(publisherData.name)) {
            throw new APIError(400, publisherMessages.requiredName);
        }

        if (!this.publisherConfig.publicIdPattern.test(publisherData.publicId)) {
            throw new APIError(400, publisherMessages.invalidPublicId);
        }

        const existingPublisher = await this.publisherModel.findOne({ publicId: publisherData.publicId });
        if (existingPublisher) {
            throw new APIError(409, publisherMessages.existedPublicId);
        }

        return await this.publisherModel.create(publisherData);
    }

    async findAll(filter = {}, attSelection = {}) {
        return await this.publisherModel.find(filter).select(attSelection.publisher || '');
    }   

    async findById(_id, attSelection = {}) {
        const validatedId = getValidatedId(_id);
        const publisher = await this.publisherModel.findById(validatedId).select(attSelection.publisher || '');
        if (!publisher) {
            throw new APIError(404, processMessages.notFound(publisherMessages.publisher, { id: _id }));
        }
        return publisher;
    }

    async updateBasicInfoById(_id, payload) {
        delete payload.publicId; 
    
        const updatedData = await this.extractPublisherData(payload);
        const publisher = await this.findById(_id, { publisher: '_id' });
    
        Object.assign(publisher, updatedData);
        return await publisher.save();
    }
    

    async checkRefBeforeDelete(publisher) {
        const filter = { publisher: publisher._id };
        if (await Book.exists(filter)) {
            throw new APIError(400, processMessages.foreignKeyDeletionError(
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