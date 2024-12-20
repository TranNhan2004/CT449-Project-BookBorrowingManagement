const { Staff, staffConfig } = require('../../models/book.accounts/staff.model');
const { staffMessages, processMessages } = require('../../messages/vi.message');
const { ApiError } = require('../../utils/error.util');
const { getValidatedId, isDefined } = require('../../utils/validationData.util');
const UserService = require('./user.service');

class StaffService extends UserService {
    constructor() {
        super();
        this.staffModel = Staff;
        this.staffConfig = staffConfig;
    }

    async create(payload) {
        payload.role = 'staff';
        
        if (!isDefined(payload.position)) {
            throw new ApiError(400, staffMessages.requiredPosition);
        }
        if (!this.staffConfig.positionEnum.includes(payload.position)) {
            throw new ApiError(400, staffMessages.invalidPosition);
        }
        
        const user = await super.createForUser(payload);
    
        const staffData = {
            user: user._id,
            position: payload.position
        };

        return await this.staffModel.create(staffData);
    }

    /**
     * 
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
        return await this.staffModel.find(filter).select(attSelection.staff || '').populate(fkSelections);
    }

    async findById(_id, attSelection = {}) {
        const validatedId = getValidatedId(_id);
        const staff = await this.staffModel.findById(validatedId).select(attSelection.staff || '');
        if (!staff) {
            throw new ApiError(404, processMessages.notFound(staffMessages.staff, { id: _id }));
        }

        const fkSelections = await this.extractFKSelections(attSelection);
        return await staff.populate(fkSelections);
    }

    async findOne(filter = {}, attSelection = {}, throwError = true) {
        const staff = await this.staffModel.findOne(filter).select(attSelection.staff);
        if (!staff && throwError) {
            throw new ApiError(404, processMessages.notFound(staffMessages.staff, filter));
        }
        const fkSelections = await this.extractFKSelections(attSelection);
        return await staff.populate(fkSelections);
    }

    async updateBasicInfoById(_id, payload) {
        const attSelection = { staff: 'user', user: '_id' };
        const staff = await this.findById(_id, attSelection);
        return await super.updateBasicInfoByIdForUser(staff.user._id, payload);
    }

    async updatePasswordById(_id, oldPassword, newPassword, confirmedNewPassword) {
        const attSelection = { staff: 'user', user: '_id' };
        const staff = await this.findById(_id, attSelection);
        return await super.updatePasswordByIdForUser(staff.user._id, oldPassword, newPassword, confirmedNewPassword);
    }

    async updateValidationById(_id, isValid) {
        const attSelection = { staff: 'user', user: '_id' };
        const staff = await this.findById(_id, attSelection);
        return await super.updateValidationByIdForUser(staff.user._id, isValid);
    }

    async deleteById(_id) {
        const attSelection = { staff: 'user', user: '_id' };
        const staff = await this.findById(_id, attSelection);
        const userId = staff.user._id;
        await this.staffModel.deleteOne({ _id: staff._id });
        return await super.deleteByIdForUser(userId);
    }

    async deleteAll() {
        await this.staffModel.deleteMany({});
        return await super.deleteAllByRoleForUser('staff');
    }
}

module.exports = StaffService;
