const { Reader, readerConfig } = require('../../models/book.accounts/reader.model');
const { readerMessages, processMessages } = require('../../messages/vi.message');
const { ApiError } = require('../../utils/error.util');
const { getValidatedId } = require('../../utils/validation.util');
const UserService = require('./user.service');

class ReaderService extends UserService {
    constructor() {
        super();
        this.readerModel = Reader;
        this.readerConfig = readerConfig;
    }

    async create(payload) {
        payload.role = 'reader';
        const user = await super.createForUser(payload);
        const readerData = { 
            user: user._id,
            rank: { ...this.readerConfig.rankEnum[0] }
        };
        return await this.readerModel.create(readerData);
    }

    /**
     * @param {Object} attSelection 
     * @returns 
     */
    async extractFKSelections(attSelection = {}) {
        let fkSelections = [];
        if (attSelection.user) {
            fkSelections.push({ path: 'user', select: attSelection.user });
        }
        return fkSelections;
    }

    async findAll(filter = {}, attSelection = {}) {
        const fkSelections = await this.extractFKSelections(attSelection);
        return await this.readerModel.find(filter).select(attSelection.reader || '').populate(fkSelections);
    }
    
    async findById(_id, attSelection = {}) {
        const validatedId = getValidatedId(_id);
        const reader = await this.readerModel.findById(validatedId).select(attSelection.reader || '');
        if (!reader) {
            throw new ApiError(404, processMessages.notFound(readerMessages.reader, { id: _id }));
        }

        const fkSelections = await this.extractFKSelections(attSelection);
        return await reader.populate(fkSelections);
    }

    async findOne(filter = {}, attSelection = {}, throwError = true) {
        const reader = await this.readerModel.findOne(filter).select(attSelection.reader);
        if (!reader && throwError) {
            throw new ApiError(404, processMessages.notFound(readerMessages.reader, filter));
        }
        const fkSelections = await this.extractFKSelections(attSelection);
        return reader.populate(fkSelections);
    }

    async updateBasicInfoById(_id, payload) {
        const attSelection = { reader: 'user', user: '_id' };
        const reader = await this.findById(_id, attSelection);
        return await super.updateBasicInfoByIdForUser(reader.user._id, payload);
    }

    async updatePasswordById(_id, oldPassword, newPassword) {
        const attSelection = { reader: 'user', user: '_id' };
        const reader = await this.findById(_id, attSelection);
        return await super.updatePasswordByIdForUser(reader.user._id, oldPassword, newPassword);
    }

    async updateRankById(_id) {
        const reader = await this.findById(_id);  
    
        for (let i = 0; i < this.readerConfig.rankEnum.length; i++) {
            const { minPoints, maxPoints } = this.readerConfig.rankEnum[i];
            if (reader.points >= minPoints && reader.points <= maxPoints) {
                reader.rank = { ...this.readerConfig.rankEnum[i] };
                break;
            }
        }
    
        return await reader.save();  
    }
    
    async updatePointsById(_id, pointsChanges) {
        const reader = await this.findById(_id);  
        reader.points = Math.max(reader.points + pointsChanges, this.readerConfig.minPoints);  
    
        await reader.save();  
    
        if (reader.points === this.readerConfig.disableThreshold) {
            return await this.updateValidationById(_id, false);
        } else {
            return await this.updateRankById(_id);
        }
    }

    async updateCurrentReservationQuantityById(_id, quantityChanges) {
        const reader = await this.findById(_id);  
        reader.currentReservationQuantity = Math.max(reader.currentReservationQuantity + quantityChanges, 0);
        return await reader.save();
    }

    async updateCurrentBorrowingQuantityById(_id, quantityChanges) {
        const reader = await this.findById(_id);  
        reader.currentBorrowedQuantity = Math.max(reader.currentBorrowingQuantity + quantityChanges, 0);
        return await reader.save();
    }
    
    async updateValidationById(_id, isValid) {
        const attSelection = { reader: 'user', user: '_id' };
        const reader = await this.findById(_id, attSelection);
        return await super.updateValidationByIdForUser(reader.user._id, isValid);
    }

    async deleteById(_id) {
        const attSelection = { reader: 'user', user: '_id' };
        const reader = await this.findById(_id, attSelection);
        const userId = reader.user._id;
        await this.readerModel.deleteOne({ _id: reader._id });
        return await super.deleteByIdForUser(userId);
    }

    async deleteAll() {
        await this.readerModel.deleteMany({});
        return await super.deleteAllByRoleForUser('reader');
    }

}

module.exports = ReaderService;