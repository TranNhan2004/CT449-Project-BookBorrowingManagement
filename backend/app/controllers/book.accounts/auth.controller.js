const { processMessages } = require('../../messages/vi.message');
const AuthenticationService = require('../../services/book.accounts/auth.service');
const { asyncHandler } = require('../../utils/asyncHandler.util');

const authenticationService = new AuthenticationService();


exports.signup = (role) => asyncHandler(async(req, res) => {
    const payload = { ...req.body };

    const user = await authenticationService.signup(payload, role);
    return res.status(201).json({
        success: true,
        message: processMessages.success('Đăng ký tài khoản'),
        data: user
    });
        
}, processMessages.serverError('đăng ký tài khoản'));


exports.login = asyncHandler(async(req, res) => {
    const { phoneOrEmail, password } = req.body;
    const specificUser = await authenticationService.login(res, phoneOrEmail, password);
    return res.status(200).json({
        success: true,
        message: processMessages.success('Đăng nhập'),
        data: specificUser
    });
}, processMessages.serverError('đăng nhập'));


exports.protect = asyncHandler(async (req, res, next) => {
    if(await authenticationService.protect(req)) {
        next();
    }
});


exports.validate = asyncHandler(async (req, res) => {
    const validatedUser = await authenticationService.protect(req);
    return res.status(200).json({
        success: true,
        message: processMessages.success('Đăng nhập'),
        data: validatedUser
    });
});


exports.restrictToReader = () => {
    return authenticationService.restrictToReader(); 
};


exports.restrictToStaff = (positions) => {
    return authenticationService.restrictToStaff(positions); 
}


exports.logout = asyncHandler(async (_req, res) => {
    await authenticationService.logout(res);
    return res.status(200).json({
        success: true,
        message: processMessages.success('Đăng xuất')
    });
}, processMessages.serverError(500, 'Đăng xuất'));