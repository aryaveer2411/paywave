class ApiError extends Error {
  statusCode: number;
  message: string;
  errors?: Error[];
  stack?: string;

  constructor(
    statusCode: number,
    message: string,
    errors?: Error[],
    stack?: string,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    if (errors) {
      this.errors = errors;
    }
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
