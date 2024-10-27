const User = require('../../models/book.accounts/user.model');
const { userMessages, processMessages } = require('../../messages/vi.message');
const APIError = require('../../utils/error.util');

class UserService {
    constructor() {
        this.userQuery = User;
    }

    async extractUserData(payload) {
        const user = {
            phone: payload.phone,
            email: payload.email,
            password: payload.password,
            surname: payload.surname,
            name: payload.name,
            birth: payload.birth,
            sex: payload.sex,
            address: payload.address,
            role: payload.role
        };

        // Remove fields with undefined values
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );

        return user;
    }

    async checkRequiredFields(payload) {
        let requiredMessage = null;

        if (!payload.phone) {
            requiredMessage = userMessages.requiredPhone; 
        } else if (!payload.email) {
            requiredMessage = userMessages.requiredEmail; 
        } else if (!payload.password) {
            requiredMessage = userMessages.requiredPassword; 
        } else if (!payload.surname) {
            requiredMessage = userMessages.requiredSurname; 
        } else if (!payload.name) {
            requiredMessage = userMessages.requiredName; 
        } else if (!payload.birth) {
            requiredMessage = userMessages.requiredBirth;
        } else if (!payload.sex) {
            requiredMessage = userMessages.requiredSex;
        } else if (!payload.address) {
            requiredMessage = userMessages.requiredAddress; 
        } else if (!payload.role) {
            requiredMessage = userMessages.requiredRole;
        }

        return requiredMessage;
    } 

    async checkPhoneNumber(payload) {
        let phoneMessage = null;

        if (payload.phone.length < 10) { 
            phoneMessage = userMessages.phoneMinLength;
        }
        const phoneRegex = /^[0-9]+$/; 
        if (!phoneRegex.test(payload.phone)) {
            phoneMessage = userMessages.phoneFormat;
        }

        return phoneMessage;
    }

    async checkEmail(payload) {
        let emailMessage = null;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(payload.email)) {
            emailMessage = userMessages.emailFormat;
        }

        return emailMessage;
    }

    async checkPassword(payload) {
        let passwordMessage = null;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/; 

        if (payload.password.length < 8) {
            passwordMessage = userMessages.passwordMinLength;
        } else if (payload.password.length > 20) {
            passwordMessage = userMessages.passwordMaxLength;
        } else if (!passwordRegex.test(payload.password)) {
            passwordMessage = userMessages.passwordFormat;
        }

        return passwordMessage;
    }

    async checkRole(payload) {
        let roleMessage = null;
        if (!['reader', 'staff'].includes(payload.role)) {
            roleMessage = userMessages.invalidRole;
        }
        return roleMessage;
    }

    async checkExistingUser(payload) {
        let existingUserMessages = null;
        let existingUserId = null;

        // Check for existing username, phone, and email simultaneously for optimization
        const existingUser = await this.userQuery.findOne({
            $or: [
                { phone: payload.phone },
                { email: payload.email }
            ]
        });

        if (existingUser) {
            existingUserId = existingUser._id.toString();
            if (existingUser.phone === payload.phone) {
                existingUserMessages = userMessages.existedPhone; 
            } else if (existingUser.email === payload.email) {
                existingUserMessages = userMessages.existedEmail; 
            }
        }

        return { existingUserMessages, existingUserId };
    }

    async create(payload) {
        // Check for required fields
        const requiredMessage = await this.checkRequiredFields(payload);
        if (requiredMessage) {
            throw new APIError(400, requiredMessage);
        }
        
        // Check length and format of phone number
        const phoneMessage = await this.checkPhoneNumber(payload);
        if (phoneMessage) {
            throw new APIError(400, phoneMessage);
        }

        // Check format of email
        const emailMessage = await this.checkEmail(payload);
        if (emailMessage) {
            throw new APIError(400, emailMessage);
        }
        
        // Check length and format of password
        const passwordMessage = await this.checkPassword(payload);
        if (passwordMessage) {
            throw new APIError(400, passwordMessage);
        }

        // Check role
        const roleMessage = await this.checkRole(payload);
        if (roleMessage) {
            throw new APIError(400, roleMessage);
        }

        // Check existing user
        const { existingUserMessages } = await this.checkExistingUser(payload);
        if (existingUserMessages) {
            throw new APIError(409, existingUserMessages);
        }

        // Extract user data and create a new user
        const userData = await this.extractUserData(payload);
        return await this.userQuery.create(userData);
    }

    async findAll(query = {}) {
        return await this.userQuery.find(query);
    }

    async findById(_id) {
        const user = await this.userQuery.findById(_id);
        if (!user) {
            throw new APIError(404, processMessages.notFound('người dùng', { id: _id }));
        }
        return user;
    }

    async findOne(query) {
        const user = await this.userQuery.findOne(query);
        if (!user) {
            throw new APIError(404, processMessages.notFound('người dùng', query));
        }
        return user;
    }

    async updateBasicInfoById(_id, payload) {
        delete payload.password;

        const updatedData = await this.extractUserData(payload); 
        const user = await this.findById(_id);

        const { existingUserMessages, existingUserId } = await this.checkExistingUser(updatedData);
    
        if (existingUserMessages && existingUserId !== _id) {
            throw new APIError(409, existingUserMessages);
        }

        Object.assign(user, updatedData);
        await user.save();
        return user;
    }

    async changePassword(_id, oldPassword, newPassword) {
        if (!oldPassword || !newPassword) {
            throw new APIError(400, userMessages.requiredPassword);
        }

        const user = await this.findById(_id);
        if (user.password !== oldPassword) {
            throw new APIError(400, userMessages.incorrectOldPassword);
        }
        
        const passwordMessage = await this.checkPassword({ password: newPassword });
        if (passwordMessage) {
            throw new APIError(400, passwordMessage);
        }

        user.password = newPassword;
        await user.save();
        return user;
    }

    async deleteById(_id) {
        const user = await this.findById(_id);
        const result = await user.remove();
        return result.deletedCount;
    }

    async deleteAll() {
        const result = await this.userQuery.deleteMany({});
        return result.deletedCount;
    }

    async disable(_id) {
        const user = await this.findById(_id);
        user.isValid = false;
        await user.save();
        return user;
    }
}

module.exports = UserService;
