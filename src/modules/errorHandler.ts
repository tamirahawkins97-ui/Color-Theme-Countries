export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  HTTP = 'HTTP_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode?: number;
  public readonly timestamp: string;

  constructor(message: string, type: ErrorType = ErrorType.UNKNOWN, statusCode?: number) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();

    // Restores proper prototype chain in TypeScript transpilation
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class HttpError extends AppError {
  constructor(message: string, statusCode: number) {
    let type = ErrorType.HTTP;
    if (statusCode === 404) type = ErrorType.NOT_FOUND;
    if (statusCode === 401 || statusCode === 403) type = ErrorType.UNAUTHORIZED;

    super(message, type, statusCode);
    this.name = 'HttpError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network connection failed. Please check your internet.') {
    super(message, ErrorType.NETWORK);
    this.name = 'NetworkError';
  }
}