// Centralized logging utility

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  component?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;

  private formatMessage(level: LogLevel, message: string, data?: any, component?: string): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      component,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) {
      return true; // Log everything in development
    }
    
    if (this.isProduction) {
      return level === 'warn' || level === 'error'; // Only warnings and errors in production
    }
    
    return false;
  }

  private log(level: LogLevel, message: string, data?: any, component?: string): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const logEntry = this.formatMessage(level, message, data, component);
    
    if (this.isDevelopment) {
      // Use console methods in development for better debugging
      const consoleMethod = level === 'debug' ? 'log' : level;
      console[consoleMethod](`[${logEntry.timestamp}] [${level.toUpperCase()}]${component ? ` [${component}]` : ''}: ${message}`, data || '');
    } else {
      // In production, you might want to send logs to a logging service
      // For now, we'll just use console for critical logs
      if (level === 'error' || level === 'warn') {
        console[level](`[${logEntry.timestamp}] [${level.toUpperCase()}]${component ? ` [${component}]` : ''}: ${message}`, data || '');
      }
    }
  }

  debug(message: string, data?: any, component?: string): void {
    this.log('debug', message, data, component);
  }

  info(message: string, data?: any, component?: string): void {
    this.log('info', message, data, component);
  }

  warn(message: string, data?: any, component?: string): void {
    this.log('warn', message, data, component);
  }

  error(message: string, data?: any, component?: string): void {
    this.log('error', message, data, component);
  }
}

export const logger = new Logger();

// Convenience functions for common use cases
export const logApiCall = (endpoint: string, method: string, component?: string) => {
  logger.debug(`API Call: ${method} ${endpoint}`, undefined, component);
};

export const logApiError = (endpoint: string, error: any, component?: string) => {
  logger.error(`API Error: ${endpoint}`, error, component);
};

export const logUserAction = (action: string, data?: any, component?: string) => {
  logger.info(`User Action: ${action}`, data, component);
};
