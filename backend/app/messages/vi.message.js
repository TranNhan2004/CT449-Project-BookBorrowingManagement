module.exports = {
    processMessages: {
        success: (process) => `${process} thành công!`,
        notFound: (object, query = null) => query === null ? 
                                    `Không tìm thấy ${object}!` : 
                                    `Không tìm thấy ${object} với truy vấn ${JSON.stringify(query)}!`,
        fobidden: (action) => `Không có quyền ${action}!`,
        serverError: (process) => `Một lỗi đã xảy ra trong hệ thống trong quá trình ${process}! Vui lòng thử lại sau!`,
        foreignKeyDeletionError: (source, sourceName, target) => 
            `Không thể xóa ${source} ${sourceName} vì vẫn có ${target} tham chiếu đến ${source}.`
    
    },

    actionMessages: {

    },
    
    authMessages: {
        invalidToken: 'Mã token không hợp lệ!',
        expiredToken: 'Mã token đã hết hạn!',
    },

    userMessages: {
        user: 'người dùng',
        existedPhone: 'Số điện thoại đã tồn tại, vui lòng dùng số điện thoại khác!',
        existedEmail: 'Email đã tồn tại, vui lòng dùng email khác!',
        requiredPhone: 'Số điện thoại không được để trống!',
        requiredEmail: 'Email không được để trống!',
        requiredPassword: 'Mật khẩu không được để trống!',
        requiredSurname: 'Họ và tên đệm không được để trống!',
        requiredName: 'Tên không được để trống!',
        requiredBirth: 'Ngày sinh không được để trống!',
        requiredGender: 'Giới tính không được để trống!',
        requiredAddress: 'Địa chỉ không được để trống!',
        requiredRole: 'Vai trò không được để trống!',
        passwordMinLength: (length) => `Mật khẩu phải có ít nhất ${length} ký tự!`,
        passwordMaxLength: (length) => `Mật khẩu chỉ có tối đa ${length} ký tự!`,
        phoneMinLength: (length) => `Số điện thoại phải có ít nhất ${length} số!`,
        phoneFormat: 'Số điện thoại chỉ được chứa ký tự số!',
        emailFormat: 'Email không đúng định dạng!',
        passwordFormat: 'Mật khẩu phải có ít nhất 1 ký tự thường (a-z), 1 ký tự hoa (A-Z), 1 chữ số (0-9) và 1 ký tự đặc biệt (@$!%*?&)!',
        incorrectOldPassword: 'Mật khẩu cũ không chính xác. Mời bạn nhập lại!',
        invalidGender: 'Giới tính không hợp lệ!',
        invalidRole: 'Vai trò không hợp lệ!',
        invalidBirth: (minDate, maxDate) => `Ngày sinh không hợp lệ, phải nằm trong khoảng ${minDate} đến ${maxDate}!`
    },

    staffMessages: {
        staff: 'nhân viên',
        requiredPosition: 'Vị trí việc làm của nhân viên không được để trống!',
        invalidPosition: 'Vị trí việc làm nhân viên không hợp lệ!',
    },

    readerMessages: {
        reader: 'độc giả',
    },

    authorMessages: {
        author: 'tác giả',
        existedPublicId: 'Id công khai của tác giả đã tồn tại, vui lòng chọn id khác!',
        requiredPublicId: 'Id công khai của tác giả không được để trống!',
        requiredName: 'Tên tác giả không được để trống!',
        invalidPublicId: 'Id công khai của tác giả phải là chuỗi có 5 ký tự số!',
    },

    topicMessages: {
        topic: 'chủ đề',
        existedPublicId: 'Id công khai của chủ đề đã tồn tại, vui lòng chọn id khác!',
        requiredPublicId: 'Id công khai của chủ đề không được để trống!',

        existedName: 'Tên chủ đề đã tồn tại, vui lòng chọn tên khác!',
        requiredName: 'Tên của chủ đề không được để trống!',
        invalidPublicId: 'Id công khai của chủ đề phải là chuỗi có 5 ký tự số!'
    },

    publisherMessages: {
        publisher: 'nhà xuất bản',
        existedPublicId: 'Id công khai của nhà xuất bản đã tồn tại, vui lòng chọn id khác!',
        requiredPublicId: 'Id công khai của nhà xuất bản không được để trống!',
        requiredName: 'Tên của nhà xuất bản không được để trống!',
        invalidPublicId: 'Id công khai của nhà xuất bản phải là chuỗi có 5 ký tự số!'
    },

    bookMessages: {
        book: 'sách',
        existedAuthor: 'Tác giả đã tồn tại, vui lòng chọn tác giả khác!',
        existedTopic: 'Chủ đề đã tồn tại, vui lòng chọn chủ đề khác!',
        requiredAuthors: 'Sách phải có ít nhất 1 tác giả!',
        requiredPublisher: 'Nhà xuất bản không được để trống!',
        requiredAddedBy: 'Nhân viên thêm sách không được để trống!',
        requiredTitle: 'Tiêu đề sách không được để trống!',
        requiredImage: 'Ảnh sách không được để trống!',
        requiredPrice: 'Giá của sách không được để trống!',
        requiredPublishedYear: 'Năm sản xuất sách không được để trống!',
        requiredItemNumber: 'Số lượng bản sao sách không được để trống!',
        requiredTopics: 'Sách phải có ít nhất 1 chủ đề!',
        requiredLanguage: 'Ngôn ngữ của sách không được để trống!',
        topicsMaxLength: (maxLength) => `Mỗi sách chỉ có tối đa ${maxLength} chủ đề!`,
        invalidLanguage: 'Ngôn ngữ của sách không hợp lệ!',
        invalidPublishedYear: (minYear, maxYear) =>
            `Năm sản xuất của sách phải nằm trong khoảng năm ${minYear} đến năm ${maxYear}!`,
        invalidPrice: (minPrice) => `Giá bán của sách phải lớn hơn ${minPrice}!`
    },

    bookItemMessages: {
        bookItem: 'bản sao sách',
        requiredBook: 'Sách không được để trống!',
        requiredAddedBy: 'Nhân viên thêm bản sao không được để trống!',
        requiredBorrowPermission: 'Quyền mượn bản sao sách không được để trống!',
        requiredStatus: 'Trạng thái bản sao sách không được để trống!',
        invalidStatus: 'Trạng thái bản sao sách không hợp lệ!'
    },

    bookBorrowingMessages: {
        bookBorrowing: 'bản ghi mượn sách',
        requiredBorrowedBy: 'Độc giả không được để trống!',
        requiredBookItem: 'Bản sao của sách mượn không được để trống!',
        requiredApprovedBy: 'Nhân viên phê duyệt không được để trống!',
        canNotBorrow: 'Bản sao sách đã được mượn hoặc đã có người đặt trước hoặc không còn tồn tại!',
        returned: 'Bản sao sách đã trả rồi!',
        maxBorrowBookItems: (maxQuantity) => `Chỉ có thể mượn tối đa ${maxQuantity} bản sao sách!` 
    },

    bookRecommendationMessages: {
        bookRecommendation: 'bản ghi đề xuất sách hay',
        existedAuthorName: 'Tác giả của sách đề xuất đã tồn tại, vui lòng nhập tên tác giả khác!',
        requiredRecommendedBy: 'Độc giả đề xuất không được để trống!',
        requiredApprovedBy: 'Nhân viên duyệt đề xuất sách hay không được để trống!',
        requiredBookTitle: 'Tiêu đề của sách đề xuất không được để trống!',
        requiredAuthorsName: 'Tác giả của sách đề xuất không được để trống!',
        requiredPublishedYear: 'Năm xuất bản của sách đề xuất không được để trống!',
        requiredBookCoverImage: 'Ảnh bìa của sách đề xuất không được để trống!',
        requiredDescription: 'Mô tả của sách đề xuất không được để trống!',
        requiredStatus: 'Trạng thái của bản ghi đề xuất không được để trống!',
        invalidPublishedYear: (minYear, maxYear) =>
            `Năm sản xuất của sách phải nằm trong khoảng năm ${minYear} đến năm ${maxYear}!`,
        invalidStatus: 'Trạng thái của bản ghi đề xuất không hợp lệ!',
        canNotChangeStatus: 'Không thể đổi trạng thái!'
    },

    favoriteMessages: {
        favorite: 'danh mục yêu thích',
        requiredReader: 'Độc giả không được để trống!',
        requiredBook: 'Sách không được để trống!',
    },

    reservationMessages: {
        reservation: 'bản ghi đặt trước sách',
        requiredReservedBy: 'Độc giả không được để trống!',
        requiredBookItem: 'Bản sao của sách cho đặt trước không được để trống!',
        canNotReserve: 'Bản sao sách đã được mượn hoặc được đặt trước hoặc không còn tồn tại!',
        maxReserveBookItems: (maxQuantity) => `Chỉ có thể đặt trước tối đa ${maxQuantity} quyển sách!` 
    },

    reviewMessages: {
        review: 'đánh giá sách',
        requiredBook: 'Sách không được để trống!',
        requiredReader: 'Độc giả không được để trống!',
        requiredRating: 'Đánh giá sách không dược để trống khi bình luận!',
        requiredComment: 'Nội dung bình luận sách không dược để trống!',
        invalidRating: 'Đánh giá sách không hợp lệ!',
        commentMaxLength: (maxLength) => `Bình luận sách không được vượt quá ${maxLength} ký tự`
    }


};