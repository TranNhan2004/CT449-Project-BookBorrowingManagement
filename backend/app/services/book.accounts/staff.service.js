const UserService = require('./user.service');
const Staff = require('../../models/book.accounts/staff.model');
const { staffMessages, processMessages } = require('../../messages/vi.message');
const APIError = require('../../utils/error.util');

class StaffService extends UserService {
    constructor() {
        super();
        this.staffQuery = Staff;
    }

    async create(payload) {
        payload.role = 'staff';
        
        if (!payload.position) {
            throw new APIError(400, staffMessages.requiredPosition);
        }
        if (!['admin', 'librarian'].includes(payload.position)) {
            throw new APIError(400, staffMessages.invalidPosition);
        }

        const user = await super.create(payload);

        const staffData = {
            user: user._id,
            position: payload.position
        };

        return await this.staffQuery.create(staffData);
    }

    async findAll(query = {}) {
        return await this.staffQuery.find(query).populate('user');
    }

    async findById(_id) {
        const staff = await this.staffQuery.findById(_id).populate('user');
        if (!staff) {
            throw new APIError(404, processMessages.notFound('nhân viên', { id: _id }));
        }
        return staff;
    }

    async findOne(query) {
        const staff = await this.staffQuery.findOne(query).populate('user');
        if (!staff) {
            throw new APIError(404, processMessages.notFound('nhân viên', query));
        }
        return staff;
    }

    async updateBasicInfoById(_id, payload) {
        const staff = await this.findById(_id);
        return await super.updateBasicInfoById(staff.user._id, payload);
    }

    async changePassword(_id, oldPassword, newPassword) {
        const staff = await this.findById(_id);
        return await super.changePassword(staff.user._id, oldPassword, newPassword);
    }

    async changePosition(_id, position) {
        const staff = await this.findById(_id);
        staff.position = position;
        await staff.save();
        return staff;
    }

    async deleteById(_id) {
        const staff = await this.findById(_id);
        const userId = staff.user._id;
        await staff.remove();
        return await super.deleteById(userId);
    }

    async deleteAll() {
        const allStaff = await this.findAll();
        const userDeletionPromises = allStaff.map(async (staff) => {
            await super.deleteById(staff.user._id);
        });
        
        const result = await this.staffQuery.deleteMany({});
        await Promise.all(userDeletionPromises);
        
        return result.deletedCount;
    }
    
    async disable(_id) {
        const staff = await this.findById(_id);
        return await super.disable(staff.user._id);
    }
}

module.exports = StaffService;
