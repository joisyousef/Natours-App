class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperatoinal = true;

    Error.captureStackTrace(this, this.constuctor);
  }
}

module.exports = AppError;
