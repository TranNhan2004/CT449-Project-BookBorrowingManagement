// export default = {
//     // processMessages: {
//     //     success: (process: s) => `${process} thành công!`,
//     //     notFound: (object, query = null) => query === null ? 
//     //                                 `Không tìm thấy ${object}!` : 
//     //                                 `Không tìm thấy ${object} với truy vấn ${JSON.stringify(query)}!`,
//     //     serverError: (process) => `Một lỗi đã xảy ra trong hệ thống trong quá trình ${process}! Vui lòng thử lại sau!`,
//     //     foreignKeyDeletionError: (source, sourceName, target) => 
//     //         `Không thể xóa ${source} ${sourceName} vì vẫn có ${target} tham chiếu đến ${source}.`

//     // },




// };


export const authMessages = {
    invalidToken: `Mã token không hợp lệ!`,
    expiredToken: `Mã token đã hết hạn!`,
    requiredPhoneOrEmail: `Số điện thoại hoặc email không được để trống`,
    requiredPassword: `Mật khẩu không được để trống!`,
    incorrectLoginInfo: `Email chưa được đăng ký tài khoản hoặc mật khẩu không đúng!`,
    invalidAccount: `Tài khoản đã bị vô hiệu hóa! Không thể đăng nhập!`,
    unauthorized: `Tài khoản chưa được đăng nhập!`,
    fobidden: `Bạn không có quyền truy cập vào đường dẫn này!`
};

export const userMessages = {
    existedPhone: () => `Số điện thoại đã tồn tại, vui lòng dùng số điện thoại khác!`,
    existedEmail: () => `Email đã tồn tại, vui lòng dùng email khác!`,
    requiredPhone: () => `Số điện thoại không được để trống!`,
    requiredEmail: () => `Email không được để trống!`,
    requiredPassword: () => `Mật khẩu không được để trống!`,
    requiredFirstName: () => `Họ không được để trống!`,
    requiredLastName: () => `Tên không được để trống!`,
    requiredBirthDate: () => `Ngày sinh không được để trống!`,
    requiredGender: () => `Giới tính không được để trống!`,
    requiredAddress: () => `Địa chỉ không được để trống!`,
    requiredRole: () => `Vai trò không được để trống!`,
    requiredNewPassword: () => `Mật khẩu mới không được để trống!`,
    passwordMinLength: (length: number) => `Mật khẩu phải có ít nhất ${length} ký tự!`,
    passwordMaxLength: (length: number) => `Mật khẩu chỉ có tối đa ${length} ký tự!`,
    phoneMinLength: (length: number) => `Số điện thoại phải có ít nhất ${length} số!`,
    phoneFormat: () => `Số điện thoại chỉ được chứa ký tự số!`,
    emailFormat: () => `Email không đúng định dạng!`,
    passwordFormat: () => `Mật khẩu phải có ít nhất 1 ký tự thường (a-z), 1 ký tự hoa (A-Z), 1 chữ số (0-9) và 1 ký tự đặc biệt (@$!%*?&)!`,
    newPasswordFormat: () => `Mật khẩu mới phải có ít nhất 1 ký tự thường (a-z), 1 ký tự hoa (A-Z), 1 chữ số (0-9) và 1 ký tự đặc biệt (@$!%*?&)!`,
    incorrectOldPassword: () => `Mật khẩu cũ không chính xác. Mời bạn nhập lại!`,
    invalidGender: () => `Giới tính không hợp lệ!`,
    invalidRole: () => `Vai trò không hợp lệ!`,
    invalidBirthDate: () => `Ngày sinh không hợp lệ!`,
    invalidOrExpiredToken: () => `Token không hợp lệ hoặc hết hạn!`,
    alreadyActivated: () => `Tài khoản đã được kích hoạt rồi!`,
    incorrectEmailOrPassword: () => `Email hoặc mật khẩu không đúng`,
    confirmNewPasswordMismatch: () => `Thông tin nhập lại mật khẩu không khớp với mật khẩu mới!`
};

export const authorMessages = {
    existedPublicId: () => `Id công khai của tác giả đã tồn tại, vui lòng chọn id khác!`,
    requiredPublicId: () => `Id công khai của tác giả không được để trống!`,
    requiredName: () => `Tên của tác giả không được để trống!`,
    invalidPublicId: () => `Id công khai của tác giả phải là chuỗi có 5 ký tự số!`
};

export const topicMessages = {
    existedPublicId: () => `Id công khai của chủ đề đã tồn tại, vui lòng chọn id khác!`,
    requiredPublicId: () => `Id công khai của chủ đề không được để trống!`,
    existedName: () => `Tên chủ đề đã tồn tại, vui lòng chọn tên khác!`,
    requiredName: () => `Tên của chủ đề không được để trống!`,
    invalidPublicId: () => `Id công khai của chủ đề phải là chuỗi có 5 ký tự số!`
};

export const publisherMessages = {
    existedPublicId: () => `Id công khai của nhà xuất bản đã tồn tại, vui lòng dùng id khác!`,
    requiredPublicId: () => `Id công khai của nhà xuất bản không được để trống!`,
    requiredName: () => `Tên của nhà xuất bản không được để trống!`,
    invalidPublicId: () => `Id công khai của nhà xuất bản phải là chuỗi có 5 ký tự số!`
};

export const languageMessages = {
    existedPublicId: () => `Id công khai của ngôn ngữ đã tồn tại, vui lòng chọn id khác!`,
    requiredPublicId: () => `Id công khai của ngôn ngữ không được để trống!`,
    existedName: () => `Tên ngôn ngữ đã tồn tại, vui lòng chọn tên khác!`,
    requiredName: () => `Tên của ngôn ngữ không được để trống!`,
    invalidPublicId: () => `Id công khai của ngôn ngữ phải là chuỗi có 5 ký tự số!`
};

export const bookMessages = {
    existedAuthor: () => `Tác giả đã tồn tại, vui lòng chọn tác giả khác!`,
    existedTopic: () => `Chủ đề đã tồn tại, vui lòng chọn chủ đề khác!`,
    requiredAuthors: () => `Sách phải có ít nhất 1 tác giả!`,
    requiredPublisher: () => `Nhà xuất bản không được để trống!`,
    requiredAddedBy: () => `Nhân viên thêm sách không được để trống!`,
    requiredTitle: () => `Tiêu đề sách không được để trống!`,
    requiredImageUrl: () => `URL của ảnh sách không được để trống!`,
    requiredImage: () => `Ảnh sách không được để trống!`,
    requiredPrice: () => `Giá của sách không được để trống!`,
    requiredPublishedYear: () => `Năm sản xuất sách không được để trống!`,
    requiredItemNumber: () => `Số lượng bản sao sách không được để trống!`,
    requiredTopics: () => `Sách phải có ít nhất 1 chủ đề!`,
    requiredLanguage: () => `Ngôn ngữ của sách không được để trống!`,
    requiredNumbers: () => `Số lượng sách không được để trống!`,
    topicsMaxLength: () => `Mỗi sách chỉ có tối đa 5 chủ đề!`,
    invalidPublishedYear: (fromYear: number, toYear: number) =>
        `Năm sản xuất của sách phải nằm trong khoảng từ ${fromYear} đến ${toYear}!`,
    invalidNumbers: (num: number) => `Số lượng sách phải lớn hơn ${num}!`,
    invalidPrice: (price: number) => `Giá bán của sách phải lớn hơn hoặc bằng ${price}!`,
};

// export const bookItemMessages = {
//     bookItem: `bản sao sách`,
//     requiredBook: `Sách không được để trống!`,
//     requiredAddedBy: `Nhân viên thêm bản sao không được để trống!`,
//     requiredBorrowPermission: `Quyền mượn bản sao sách không được để trống!`,
//     requiredStatus: `Trạng thái bản sao sách không được để trống!`,
//     invalidStatus: `Trạng thái bản sao sách không hợp lệ!`
// };

export const bookBorrowingMessages = {
    requiredBorrowedBy: () => `Độc giả không được để trống!`,
    requiredBorrowedBook: () => `Sách mượn không được để trống!`,
    requiredAddedBy: () => `Nhân viên thêm bản ghi mượn sách không được để trống!`,
    maxBorrowing: (num: number) => `Chỉ có thể mượn tối đa ${num} quyển sách!`
};

export const favoriteMessages = {
    requiredReader: () => `Độc giả không được để trống!`,
    requiredBook: () => `Sách không được để trống!`,
};

export const reservationMessages = {
    requiredReservedBy: () => `Độc giả không được để trống!`,
    requiredReservedBook: () => `Sách cho đặt trước không được để trống!`,
    maxReserving: (num: number) => `Chỉ có thể đặt trước tối đa ${num} quyển sách!`
};

export const reviewMessages = {
    requiredBook: () => `Sách không được để trống!`,
    requiredReader: () => `Độc giả không được để trống!`,
    requiredRating: () => `Đánh giá sách không dược để trống khi bình luận!`,
    requiredComment: () => `Nội dung bình luận sách không dược để trống!`,
    invalidRating: () => `Đánh giá sách không hợp lệ!`,
    commentMaxLength: (maxLength: number) => `Bình luận sách không được vượt quá ${maxLength} ký tự`
}
