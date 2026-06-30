class AppError extends Error {
    constructor(message, code, httpStatus) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus
    }
}

export {
    AppError
}