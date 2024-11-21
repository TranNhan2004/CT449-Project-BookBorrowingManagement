const { Topic, topicConfig } = require('../../models/book.data/topic.model');
const { Book } = require('../../models/book.data/book.model');
const { topicMessages, bookMessages, processMessages } = require('../../messages/vi.message');
const { ApiError } = require('../../utils/error.util');
const { getValidatedId, isDefined } = require('../../utils/validationData.util');


class TopicService {

    constructor() {
        this.topicModel = Topic;
        this.topicConfig = topicConfig;
    }

    async findExistingTopic(payload) {
        const existingTopic = await this.topicModel.findOne({
            $or: [
                { publicId: payload.publicId },
                { name: payload.name }
            ]
        });

        let existingTopicId = null;
        let existingTopicMessage = null;
        if (existingTopic) {
            existingTopicId = existingTopic._id.toString();
            if (existingTopic.publicId === payload.publicId) {
                existingTopicMessage = topicMessages.existedPublicId;
            } else if (existingTopic.name === payload.name) {
                existingTopicMessage = topicMessages.existedTopic;
            } 
        }

        return { existingTopicId, existingTopicMessage };
    }

    async create(payload) {
        if (!isDefined(payload.publicId)) {
            throw new ApiError(400, topicMessages.requiredPublicId);
        }
        if (!isDefined(payload.name)) {
            throw new ApiError(400, topicMessages.requiredName);
        }

        if (!this.topicConfig.publicIdPattern.test(payload.publicId)) {
            throw new ApiError(400, topicMessages.invalidPublicId);
        }

        const { existingTopicMessage } = await this.findExistingTopic(payload);
        if (existingTopicMessage) {
            throw new ApiError(409, existingTopicMessage);
        }

        const topicData = {
            publicId: payload.publicId,
            name: payload.name
        };

        return await this.topicModel.create(topicData);
    }

    async findAll(filter = {}, attSelection = {}) {
        return await this.topicModel.find(filter).select(attSelection.topic || '');
    }   

    async findById(_id, attSelection = {}) {
        const validatedId = getValidatedId(_id);
        const topic = await this.topicModel.findById(validatedId).select(attSelection.topic || '');
        if (!topic) {
            throw new ApiError(404, processMessages.notFound(topicMessages.topic, { id: _id }));
        }
        return topic;
    }

    async incrementPublicBookIdCounter(_id) {
        const topic = await this.findById(_id);
    
        topic.publicBookIdCounter += 1;
        return await topic.save();
    }
    
    async checkRefBeforeDelete(topic) {
        const filter = { topics: topic._id };
        if (await Book.exists(filter)) {
            throw new ApiError(400, processMessages.foreignKeyDeletionError(
                topicMessages.topic,
                topic.name,
                bookMessages.book
            ));
        }
        
        return true;
    }

    async deleteById(_id) {
        const attSelection = { topic: '_id name' };
        const topic = await this.findById(_id, attSelection);
        
        await this.checkRefBeforeDelete(topic);
        
        const result = await this.topicModel.deleteOne({ _id: topic._id });
        return result.deletedCount;
    }

    async deleteAll() {
        const attSelection = { topic: '_id name' };
        const topics = await this.findAll({}, attSelection);

        await Promise.all(topics.map(async (topic) => await this.checkRefBeforeDelete(topic)));
        
        const result = await this.topicModel.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = TopicService;