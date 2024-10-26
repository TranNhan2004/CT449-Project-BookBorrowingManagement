const userMessage = {
    usernameExisted: 'Tên đăng nhập đã tồn tại, vui lòng dùng tên đăng nhập khác.',
    phoneExisted: 'Số điện thoại đã được dùng để đăng ký tài khoản, vui lòng dùng số điện thoại khác.',
    emailExisted: 'Email đã được dùng để đăng ký tài khoản, vui lòng dùng email khác.',

    usernameRequired: 'Tên đăng nhập không được để trống.',
    passwordRequired: 'Mật khẩu không được để trống.',
    surnameRequired: 'Họ và tên đệm không được để trống.',
    nameRequired: 'Tên không được để trống.',
    addressRequired: 'Email không được để trống.',
    phoneRequired: 'Số điện thoại không được để trống.',
    emailRequired: 'Email không được để trống',

    passwordMinLength: 'Mật khẩu phải có ít nhất 8 ký tự.',
    passwordMaxLength: 'Mật khẩu chỉ có tối đa 20 ký tự.',
    phoneMinLength: 'Số điện thoại phải có ít nhất 10 số.',

    passwordFormat: 'Mật khẩu phải có ít nhất 1 ký tự thường (a-z), 1 ký tự hoa (A-Z), 1 chữ số (0-9) và 1 ký tự đặc biệt (@$!%*?&).',
    phoneFormat: 'Số điện thoại chỉ được chứa ký tự số.',
    emailFormat: 'Email không đúng định dạng.',

    serverError: (process) => `Một lỗi đã xảy ra trong hệ thống trong quá trình ${process}. Vui lòng thử lại sau.`,
    userNotFound: (id) => `Không thể tìm thấy người dùng với ID: ${id}.`,
    success: (process) => `Quá trình ${process} thực hiện thành công.`

};

module.exports = userMessage;