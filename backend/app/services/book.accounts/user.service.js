const { User, userConfig } = require('../../models/book.accounts/user.model');
const { userMessages, processMessages } = require('../../messages/vi.message');
const { ApiError } = require('../../utils/error.util');
const { getValidatedId, isDefined } = require('../../utils/validation.util');
const { hashPassword } = require('../../utils/hash.util');

class UserService {
    constructor() {
        this.userModel = User;
        this.userConfig = userConfig;
    }

    async extractUserData(payload) {
        const userData = {
            phone: payload.phone,
            email: payload.email,
            password: payload.password,
            surname: payload.surname,
            name: payload.name,
            birth: payload.birth,
            gender: payload.gender,
            address: payload.address,
            role: payload.role
        };

        // Get fields with not undefined values
        Object.keys(userData).forEach(
            (key) => !isDefined(userData[key]) && delete userData[key]
        );
        
        return userData;
    }

    async checkRequiredFieldsForUser(payload) {
        if (!isDefined(payload.phone)) {
            throw new ApiError(400, userMessages.requiredPhone);
        }

        if (!isDefined(payload.email)) {
            throw new ApiError(400, userMessages.requiredEmail);
        }

        if (!isDefined(payload.password)) {
            throw new ApiError(400, userMessages.requiredPassword);
        }

        if (!isDefined(payload.surname)) {
            throw new ApiError(400, userMessages.requiredSurname); 
        }

        if (!isDefined(payload.name)) {
            throw new ApiError(400, userMessages.requiredName); 
        }

        if (!isDefined(payload.birth)) {
            throw new ApiError(400, userMessages.requiredBirth);
        }

        if (!isDefined(payload.gender)) {
            throw new ApiError(400, userMessages.requiredGender);
        }

        if (!isDefined(payload.address)) {
            throw new ApiError(400, userMessages.requiredAddress);  
        }

        if (!isDefined(payload.role)) { 
            throw new ApiError(400, userMessages.requiredRole);
        }

        return true;
    } 

    async checkGenderForUser(payload) {
        if (!this.userConfig.genderEnum.includes(payload.gender)) {
            throw new ApiError(400, userMessages.requiredGender);
        }

        return true;
    }

    async checkPhoneNumberForUser(payload) {
        if (payload.phone.length < this.userConfig.phoneMinLength) { 
            throw new ApiError(400, userMessages.phoneMinLength(this.userConfig.phoneMinLength));
        }

        if (!this.userConfig.phonePattern.test(payload.phone)) {
            throw new ApiError(400, userMessages.phoneFormat);
        }

        return true;
    }

    async checkEmailForUser(payload) {
        if (!this.userConfig.emailPattern.test(payload.email)) {
            throw new ApiError(400, userMessages.emailFormat);
        }

        return true;
    }

    async checkPasswordForUser(payload) {
        if (payload.password.length < this.userConfig.passwordMinLength) {
            throw new ApiError(400, userMessages.passwordMinLength(this.userConfig.passwordMinLength));
        }

        if (payload.password.length > this.userConfig.passwordMaxLength) {
            throw new ApiError(400, userMessages.passwordMaxLength(this.userConfig.passwordMaxLength));
        }

        if (!this.userConfig.passwordPattern.test(payload.password)) {
            throw new ApiError(400, userMessages.passwordFormat);
        }

        return true;
    }

    async checkRoleForUser(payload) {
        if (!this.userConfig.roleEnum.includes(payload.role)) {
            throw new ApiError(400, userMessages.invalidRole);
        }

        return true;
    }

    async checkBirthForUser(payload) {
        const birth = new Date(payload.birth);
        const minBirth = this.userConfig.getMinBirth();
        const maxBirth = this.userConfig.getMaxBirth();
        if (isNaN(birth.getTime()) || birth < minBirth || birth > maxBirth) {
            throw new ApiError(400, userMessages.invalidBirth(minBirth, maxBirth));
        }

        return true;
    }

    async createForUser(payload) {
        // Check for required fields
        await this.checkRequiredFieldsForUser(payload);
        
        // Check gender
        await this.checkGenderForUser(payload);
        
        // Check phone number
        await this.checkPhoneNumberForUser(payload);

        // Check email
        await this.checkEmailForUser(payload);
       
        // Check password
        await this.checkPasswordForUser(payload);

        // Check birth
        await this.checkBirthForUser(payload);

        // Check role
        await this.checkRoleForUser(payload);

        // Check existing user
        const attSelection = { user: '_id' };
        const existingPhone = await this.findOneForUser({ phone: payload.phone }, attSelection);
        if (existingPhone) {
            throw new ApiError(409, userMessages.existedPhone);
        }
        const existingEmail = await this.findOneForUser({ email: payload.email }, attSelection);
        if (existingEmail) {
            throw new ApiError(409, userMessages.existedEmail);
        }
        
        // Extract user data and create a new user
        const userData = await this.extractUserData(payload);
        userData.password = await hashPassword(userData.password);

        return await this.userModel.create(userData);
    }

    async findAllForUser(filter = {}, attSelection = {}) {
        return await this.userModel.find(filter).select(attSelection.user);
    }

    async findByIdForUser(_id, attSelection = {}) {
        const validatedId = getValidatedId(_id);
        const user = await this.userModel.findById(validatedId).select(attSelection.user);
        if (!user) {
            throw new ApiError(404, processMessages.notFound(userMessages.user, { id: _id }));
        }
        return user;
    }

    async findOneForUser(filter = {}, attSelection = {}, throwError = true) {
        const user = await this.userModel.findOne(filter).select(attSelection.user);
        if (!user && throwError) {
            throw new ApiError(404, processMessages.notFound(userMessages.user, filter));
        }
        return user;
    }

    async updateBasicInfoByIdForUser(_id, payload) {
        delete payload.password;
        delete payload.role;
    
        if (isDefined(payload.gender)) {
            await this.checkGenderForUser(payload);
        }
    
        if (isDefined(payload.birth)) {
            await this.checkBirthForUser(payload);
        }

        if (isDefined(payload.phone)) {
            await this.checkPhoneNumberForUser(payload);

            const existingPhone = await this.findOneForUser({ phone: payload.phone }, { user: '_id' });
            if (existingPhone && existingPhone._id != _id) {
                throw new ApiError(409, userMessages.existedPhone);
            }
        }

        if (isDefined(payload.email)) {
            await this.checkEmailForUser(payload);

            const existingEmail = await this.findOneForUser({ email: payload.email }, { user: '_id' });
            if (existingEmail && existingPhone._id != _id) {
                throw new ApiError(409, userMessages.existedEmail);
            }
        }

        const updatedData = await this.extractUserData(payload);
        const user = await this.findByIdForUser(_id); 
    
        Object.assign(user, updatedData);
    
        return await user.save();
    }
    
    async updatePasswordByIdForUser(_id, oldPassword, newPassword) {
        await this.checkPasswordForUser({ password: newPassword });
    
        const user = await this.findByIdForUser(_id); 
        if (user.password !== oldPassword) {
            throw new ApiError(400, userMessages.incorrectOldPassword);
        }
    
        user.password = newPassword; 
    
        return await user.save();
    }
    
    async deleteByIdForUser(_id) {
        const attSelection = { user: '_id' }
        const user = await this.findByIdForUser(_id, attSelection);
        const result = await this.userModel.deleteOne({ _id: user._id });
        return result.deletedCount;
        
    }

    async deleteAllForUser() {
        const result = await this.userModel.deleteMany({});
        return result.deletedCount;
    }

    async deleteAllByRoleForUser(role) {
        await this.checkRoleForUser({ role: role });
        const result = await this.userModel.deleteMany({ role: role });
        return result.deletedCount;
    }

    async updateValidationByIdForUser(_id, isValid) {
        const user = await this.findByIdForUser(_id); // Fetch the entire document
        user.isValid = isValid; // Update the validation status
    
        // Save the document
        return await user.save();
    }
}

module.exports = UserService;
