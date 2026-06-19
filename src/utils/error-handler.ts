interface ErrorResponse {
  success: false;
  error: string;
  errorCode: string;
  details?: any;
}

interface SuccessResponse<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export enum ErrorCode {
  AUTHENTICATION_REQUIRED = 'AUTH_REQUIRED',
  INVALID_INPUT = 'INVALID_INPUT',
  NOT_FOUND = 'NOT_FOUND',
  API_ERROR = 'API_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function createErrorResponse(error: unknown): ErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      errorCode: error.code,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      errorCode: ErrorCode.INTERNAL_ERROR,
    };
  }

  return {
    success: false,
    error: 'An unknown error occurred',
    errorCode: ErrorCode.INTERNAL_ERROR,
  };
}

export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

export function handleApiError(error: any): AppError {
  if (error.response?.status === 401) {
    return new AppError(ErrorCode.AUTHENTICATION_REQUIRED, 'Authentication required or expired', 401);
  }

  if (error.response?.status === 403) {
    return new AppError(ErrorCode.PERMISSION_DENIED, 'Permission denied', 403);
  }

  if (error.response?.status === 404) {
    return new AppError(ErrorCode.NOT_FOUND, 'Resource not found', 404);
  }

  if (error.response?.status === 429) {
    return new AppError(
      ErrorCode.RATE_LIMITED,
      'Rate limited. Please try again later.',
      429,
      error.response?.data
    );
  }

  if (error.response?.status === 400) {
    return new AppError(
      ErrorCode.INVALID_INPUT,
      error.response?.data?.message || 'Invalid input',
      400,
      error.response?.data
    );
  }

  return new AppError(
    ErrorCode.API_ERROR,
    error.message || 'API error occurred',
    error.response?.status || 500,
    error.response?.data
  );
}
