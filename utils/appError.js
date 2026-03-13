class AppError extends Error {
  constructor(message, statusCode) {
    //Inherits from parent class and sets incoming message a message property.
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';
    this.isOperational = true;

    //This tells the captureStackTrace where to attach it, this.constuctor tells it where to stop capturing. Think of the stack trace like a trail of breadcrumbs showing how execution got to a certain point. Without the second argument the trail would include the AppError constructor itself as one of the crumbs — which isn't useful because you already know the error came from AppError.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
