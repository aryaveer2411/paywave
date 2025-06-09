class ApiResponse<T = object> {
  statusCode: number;
  message: string;
  readonly success: boolean;
  data?: T;

  constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode >= 200 && statusCode < 300;
    if (data !== undefined) {
      this.data = data;
    }
  }
}

export { ApiResponse };
