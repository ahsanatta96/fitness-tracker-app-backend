const ErrorHandler = require("./error.handler");

module.exports = (err, req, res, next) => {
  let error = { ...err };
  console.log(error);
  error.message = err.message;

  error.statusCode = err.statusCode || 500;

  // Wrong Mongoose Object ID Error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    error = new ErrorHandler("Error", { castError: message }, 400);
  }

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    let message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorHandler("Error", { error: message }, 400);
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    error = new ErrorHandler("Error", { DuplicateError: message }, 400);
  }

  // Handle wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is Invalid. Try Again !!!";
    error = new ErrorHandler("Error", { JWTTokenError: message }, 400);
  }

  // Handle expire JWT error
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token is Expired. Try Again !!!";
    error = new ErrorHandler("Error", { JWTTokenExipreError: message }, 400);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
    error: err,
    stack: err.stack,
  });
};
