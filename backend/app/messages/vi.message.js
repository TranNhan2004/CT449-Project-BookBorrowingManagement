module.exports = {
    processMessages: {
        success: (process) => `${process} thành công!`,
        notFound: (object, query = null) => query === null ? 
                                    `Không tìm thấy ${object}!` : 
                                    `Không tìm thấy ${object} với truy vấn ${JSON.stringify(query)}!`,
        fobidden: (action) => `Không có quyền ${action}!`,
        serverError: (process) => `Một lỗi đã xảy ra trong hệ thống trong quá trình ${process}! Vui lòng thử lại sau!`,
    },
    authMessages: {
        invalidToken: 'Mã token không hợp lệ!',
        expiredToken: 'Mã token đã hết hạn!',
    },
    userMessages: {
        existedPhone: 'Số điện thoại đã tồn tại, vui lòng dùng số điện thoại khác!',
        existedEmail: 'Email đã tồn tại, vui lòng dùng email khác!',

        requiredPhone: 'Số điện thoại không được để trống!',
        requiredEmail: 'Email không được để trống!',
        requiredPassword: 'Mật khẩu không được để trống!',
        requiredSurname: 'Họ và tên đệm không được để trống!',
        requiredName: 'Tên không được để trống!',
        requiredBirth: 'Ngày sinh không được để trống!',
        requiredSex: 'Giới tính không được để trống!',
        requiredAddress: 'Địa chỉ không được để trống!',
        requiredRole: 'Vai trò không được để trống!',

        
        passwordMinLength: 'Mật khẩu phải có ít nhất 8 ký tự!',
        passwordMaxLength: 'Mật khẩu chỉ có tối đa 20 ký tự!',
        phoneMinLength: 'Số điện thoại phải có ít nhất 10 số!',

        phoneFormat: 'Số điện thoại chỉ được chứa ký tự số!',
        emailFormat: 'Email không đúng định dạng!',
        passwordFormat: 'Mật khẩu phải có ít nhất 1 ký tự thường (a-z), 1 ký tự hoa (A-Z), 1 chữ số (0-9) và 1 ký tự đặc biệt (@$!%*?&)!',
        
        incorrectOldPassword: 'Mật khẩu cũ không chính xác. Mời bạn nhập lại!',

        invalidRole: 'Vai trò không hợp lệ!'
    },
    staffMessages: {
        requiredPosition: 'Vị trí việc làm của nhân viên không được để trống!',
        invalidPosition: 'Vị trí việc làm nhân viên không hợp lệ!',
    },

};