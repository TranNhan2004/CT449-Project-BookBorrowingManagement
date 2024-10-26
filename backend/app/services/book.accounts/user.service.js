const User = require('../../models/book.accounts/user.model');
const userMessage = require('../../messages/book.accounts/user.message');
const APIError = require('../../utils/error.util');

class UserService {
    constructor() {
        this.userQuery = User;
    }

    async extractUserData(payload) {
        const user = {
            username: payload.username,
            password: payload.password,
            surname: payload.surname,
            name: payload.name,
            address: payload.address,
            phone: payload.phone,
            email: payload.email,
            isValid: true
        };

        // Remove fields with undefined values
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );

        return user;
    }

    async checkExistingUser(payload) {
        // Check for existing username, phone, and email simultaneously for optimization
        const existingUser = await this.userQuery.findOne({
            $or: [
                { username: payload.username },
                { phone: payload.phone },
                { email: payload.email }
            ]
        });

        let message = null;
        let id = null;

        if (existingUser) {
            id = existingUser._id.toString();
            if (existingUser.username === payload.username) {
                message = userMessage.usernameExisted;
            } else if (existingUser.phone === payload.phone) {
                message = userMessage.phoneExisted;
            } else if (existingUser.email === payload.email) {
                message = userMessage.emailExisted;
            }
        }

        return { message, id };
    }

    async create(payload) {
        // Check for required fields
        if (!payload.username) {
            throw new APIError(400, userMessage.usernameRequired);
        }
        if (!payload.password) {
            throw new APIError(400, userMessage.passwordRequired);
        }
        if (!payload.surname) {
            throw new APIError(400, userMessage.surnameRequired);
        }
        if (!payload.name) {
            throw new APIError(400, userMessage.nameRequired);
        }
        if (!payload.address) {
            throw new APIError(400, userMessage.addressRequired);
        }
        if (!payload.phone) {
            throw new APIError(400, userMessage.phoneRequired);
        }
        if (!payload.email) {
            throw new APIError(400, userMessage.emailRequired);
        }

        // Check length and format of password
        if (payload.password.length < 8) {
            throw new APIError(400, userMessage.passwordMinLength);
        }
        if (payload.password.length > 20) {
            throw new APIError(400, userMessage.passwordMaxLength);
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/; 
        if (!passwordRegex.test(payload.password)) {
            throw new APIError(400, userMessage.passwordFormat);
        }

        // Check length and format of phone number
        if (payload.phone.length < 10) { 
            throw new APIError(400, userMessage.phoneMinLength);
        }
        const phoneRegex = /^[0-9]+$/; 
        if (!phoneRegex.test(payload.phone)) {
            throw new APIError(400, userMessage.phoneFormat);
        }

        // Check format of email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(payload.email)) {
            throw new APIError(400, userMessage.emailFormat);
        }

        const { message } = await this.checkExistingUser(payload);
        if (message) {
            throw new APIError(409, message);
        }

        // Extract user data and create a new user
        const userData = await this.extractUserData(payload);
        return await this.userQuery.create(userData);
    }

    async findAll(query) {
        if (Object.keys(query).length === 0) {
            return await this.userQuery.find({});
        }

        return await this.userQuery.find(query);
    }

    async findById(_id) {
        const user = await this.userQuery.findById(_id);
        if (!user) {
            throw new APIError(404, userMessage.userNotFound(_id));
        }
        return user;
    }

    async updateById(_id, payload) {
        const updatedData = await this.extractUserData(payload); 
        const user = await this.findById(_id);

        if (!user) {
            throw new APIError(404, userMessage.userNotFound(_id));
        }

        const { message, id } = await this.checkExistingUser(updatedData);
    
        if (message && id !== _id) {
            throw new APIError(409, message);
        }

        Object.assign(user, updatedData);
        await user.save();
        return user;
    }

    async deleteById(_id) {
        const user = await this.userQuery.findByIdAndDelete(_id);
        if (!user) {
            throw new APIError(404, userMessage.userNotFound(_id));
        }
        return user;
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
