export class HttpStatus {
    // 2xx Success
    static readonly OK = 200;                    // Thành công (GET, PUT, DELETE)
    static readonly CREATED = 201;               // Tạo mới thành công (POST)
    static readonly NO_CONTENT = 204;            // Thành công nhưng không có nội dung trả về

    // 3xx Redirection
    static readonly MOVED_PERMANENTLY = 301;     // Tài nguyên đã được chuyển hẳn sang URL khác
    static readonly FOUND = 302;                 // Tài nguyên tạm thời ở URL khác
    static readonly NOT_MODIFIED = 304;          // Dữ liệu chưa thay đổi, client có thể dùng cache

    // 4xx Client errors
    static readonly BAD_REQUEST = 400;           // Request sai hoặc thiếu dữ liệu
    static readonly UNAUTHORIZED = 401;          // Chưa xác thực (chưa đăng nhập)
    static readonly FORBIDDEN = 403;             // Không có quyền truy cập
    static readonly NOT_FOUND = 404;             // Không tìm thấy tài nguyên
    static readonly CONFLICT = 409;              // Xung đột dữ liệu (VD: trùng key)
    static readonly UNPROCESSABLE_ENTITY = 422;  // Request hợp lệ nhưng dữ liệu không xử lý được
    static readonly TOO_MANY_REQUESTS = 429;     // Quá nhiều request (rate limit)

    // 5xx Server errors
    static readonly INTERNAL_SERVER_ERROR = 500; // Lỗi server chung
    static readonly NOT_IMPLEMENTED = 501;       // API chưa được implement
    static readonly BAD_GATEWAY = 502;           // Server trung gian nhận response không hợp lệ
    static readonly SERVICE_UNAVAILABLE = 503;   // Server tạm ngừng (quá tải, bảo trì)
    static readonly GATEWAY_TIMEOUT = 504;       // Server trung gian không nhận được phản hồi kịp
}
