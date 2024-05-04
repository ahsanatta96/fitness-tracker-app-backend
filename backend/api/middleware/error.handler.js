class Errorhandler extends Error {
  constructor(type, message, statusCode) {
    super(type);
    this.statusCode = statusCode;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = Errorhandler;
