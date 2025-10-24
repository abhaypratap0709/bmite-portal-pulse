// Centralized error handling utility

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  field?: string;
  value?: any;
  errors?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

export class ErrorHandler {
  static async handleApiError(response: Response): Promise<ApiError> {
    try {
      const errorData = await response.json();
      return {
        message: errorData.message || 'An error occurred',
        status: response.status,
        code: errorData.errorCode,
        field: errorData.field,
        value: errorData.value,
        errors: errorData.errors,
      };
    } catch {
      return {
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }
  }

  static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    return 'An unexpected error occurred';
  }

  static getFieldErrors(error: ApiError): Record<string, string> {
    const fieldErrors: Record<string, string> = {};
    
    if (error.errors) {
      error.errors.forEach(err => {
        fieldErrors[err.field] = err.message;
      });
    }
    
    if (error.field && error.message) {
      fieldErrors[error.field] = error.message;
    }
    
    return fieldErrors;
  }

  static isNetworkError(error: unknown): boolean {
    return error instanceof TypeError && error.message.includes('fetch');
  }

  static isTimeoutError(error: unknown): boolean {
    return error instanceof Error && error.message.includes('timeout');
  }

  static getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    return Math.min(1000 * Math.pow(2, attempt), 16000);
  }
}

export const clearError = (setError: (error: string) => void) => {
  setError('');
};

export const handleApiCall = async <T>(
  apiCall: () => Promise<Response>,
  setError: (error: string) => void,
  setLoading?: (loading: boolean) => void
): Promise<T | null> => {
  try {
    setLoading?.(true);
    clearError(setError);
    
    const response = await apiCall();
    
    if (!response.ok) {
      const error = await ErrorHandler.handleApiError(response);
      setError(error.message);
      return null;
    }
    
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    const message = ErrorHandler.getErrorMessage(error);
    setError(message);
    return null;
  } finally {
    setLoading?.(false);
  }
};
