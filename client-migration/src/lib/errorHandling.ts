import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { logger } from './loggers';

export interface APIError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleAPIError(error: unknown): AppError {
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status;
    const message = error.response?.data?.message || error.message;
    const code = error.response?.data?.code || error.code;

    logger.error('API Error:', {
      statusCode,
      message,
      code,
      url: error.config?.url,
    });

    return new AppError(message, code, statusCode, error.response?.data);
  }

  if (error instanceof Error) {
    logger.error('Error:', error.message);
    return new AppError(error.message);
  }

  logger.error('Unknown error:', error);
  return new AppError('An unexpected error occurred');
}

export function showErrorToast(error: unknown, fallbackMessage?: string) {
  const appError = handleAPIError(error);
  toast.error(fallbackMessage || appError.message);
}

export function getErrorMessage(error: unknown): string {
  return handleAPIError(error).message;
}
