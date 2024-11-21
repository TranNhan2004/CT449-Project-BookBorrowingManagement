const jwt = require('jsonwebtoken');
const { jwtEnv, cookieEnv } = require('../../config');

const { authMessages, userMessages, processMessages } = require('../../messages/vi.message');
const { ApiError } = require('../../utils/error.util');
const { isDefined } = require('../../utils/validationData.util');
const { comparePassword } = require('../../utils/hash.util');

const UserService = require('./user.service');
const StaffService = require('./staff.service');
const ReaderService = require('./reader.service');

const userService = new UserService();
const staffService = new StaffService();
const readerService = new ReaderService(); 

class AuthenticationService {
    constructor() {}

    async signup(payload, role) {
        if (role === 'staff') {
            return await staffService.create(payload);
        } else if (role === 'reader') {
            return await readerService.create(payload);
        } else {
            throw new ApiError(400, userMessages.invalidRole);
        }
    }

    signToken(payload) {
        return jwt.sign({ ...payload }, jwtEnv.secretKey);
    }

    getToken(req) {
        return req.cookies[cookieEnv.name];
    }

    setCookie(res, token) {
        res.cookie(cookieEnv.name, token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: cookieEnv.maxAge 
        });
    }

    clearCookie(res) {
        res.cookie(cookieEnv.name, '', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 0
        });
    }

    async login(res, phoneOrEmail, password) {
        if(!isDefined(phoneOrEmail)) {
            throw new ApiError(400, authMessages.requiredPhoneOrEmail);
        } 
        if (!isDefined(password)) {
            throw new ApiError(400, authMessages.requiredPassword);
        }

        const userFilter = { $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail }] };
        const userAttSelection = { user: 'password role isValid' }; 
        const user = await userService.findOneForUser(userFilter, userAttSelection);
        
        if (!user || !(await comparePassword(password, user.password))) {
            throw new ApiError(401, authMessages.incorrectLoginInfo);
        }

        if (!user.isValid) {
            throw new ApiError(403, authMessages.invalidAccount);
        }

        let specificUser;
        if (user.role === 'reader') {
            const readerFilter = { user: user._id };
            const readerAttSelection = { reader: '_id user', user: 'surname name' };
            specificUser = await readerService.findOne(readerFilter, readerAttSelection);
        
        } else if (user.role === 'staff') {
            const staffFilter = { user: user._id };
            const staffAttSelection = { staff: '_id user position', user: 'surname name' };
            specificUser = await staffService.findOne(staffFilter, staffAttSelection);
        }

        const result = {
            _id: specificUser._id,
            role: user.role,
            position: specificUser.position || null,
            fullname: specificUser.user.surname + ' ' + specificUser.user.name
        }
        
        this.setCookie(res, this.signToken({ ...result }));
        return result;
    }   

    async protect(req) {
        let token = this.getToken(req);
        if (!token) {
            throw new ApiError(401, authMessages.unauthorized);
        }

        const decodedToken = jwt.verify(token, jwtEnv.secretKey);
        if (!decodedToken) {
            throw new ApiError(401, authMessages.unauthorized);
        }

        const _id = decodedToken._id;
        let specificUser = null;
        if (decodedToken.role === 'reader') {
            const readerAttSelection = { reader: '_id user', user: 'surname name isValid' };
            specificUser = await readerService.findById(decodedToken._id, readerAttSelection);
            
        } else if (decodedToken.role === 'staff') {
            const staffAttSelection = { staff: '_id user position', user: 'surname name isValid' };
            specificUser = await staffService.findById(decodedToken._id, staffAttSelection);
        }

        if (!specificUser.user.isValid) {
            throw new ApiError(403, authMessages.invalidAccount);
        }

        req.specificUser = {
            _id: _id,
            role: decodedToken.role,
            position: decodedToken.position || null,
            fullname: specificUser.user.surname + ' ' + specificUser.user.name
        };

        return req.specificUser;
    }

    restrictToReader() {
        return (req, res, next) => {
            if (req.specificUser.role === 'reader') {
                next();
            } else {
                return next(new ApiError(403, authMessages.fobidden));
            }
        };
    }

    restrictToStaff(positions = staffService.staffConfig.positionEnum) {
        return (req, res, next) => {
            if (positions.includes(req.specificUser.position)) {
                next();
            } else {
                return next(new ApiError(403, authMessages.fobidden));
            }
        };
    }

    async logout(res) {
        this.clearCookie(res);
    }
}

module.exports = AuthenticationService;