/**
 * Application logger for centralized logging
 * Uses simple console in development, can be extended to use remote logging in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
    enabled: boolean;
    level: LogLevel;
}

const DEFAULT_OPTIONS: LoggerOptions = {
    enabled: true,
    level: 'info',
};

class Logger {
    private options: LoggerOptions;

    constructor(options: Partial<LoggerOptions> = {}) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }

    /**
     * Debug level message (development only)
     */
    debug(message: string, data?: any): void {
        if (!this.options.enabled) return;
        if (this.shouldLog('debug')) {
            console.debug(`🔍 ${message}`, data || '');
        }
    }

    /**
     * Info level message
     */
    info(message: string, data?: any): void {
        if (!this.options.enabled) return;
        if (this.shouldLog('info')) {
            console.log(`ℹ️ ${message}`, data || '');
        }
    }

    /**
     * Warning level message
     */
    warn(message: string, data?: any): void {
        if (!this.options.enabled) return;
        if (this.shouldLog('warn')) {
            console.warn(`⚠️ ${message}`, data || '');
        }
    }

    /**
     * Error level message
     */
    error(message: string, data?: any): void {
        if (!this.options.enabled) return;
        if (this.shouldLog('error')) {
            console.error(`❌ ${message}`, data || '');
        }
    }

    /**
     * Log API request
     */
    logApiRequest(method: string, url: string, data?: any): void {
        this.info(`API REQUEST: ${method} ${url}`, { timestamp: new Date().toISOString(), data });
    }

    /**
     * Log API response
     */
    logApiResponse(method: string, url: string, status: number, duration: number): void {
        this.info(`API RESPONSE: ${method} ${url} | Status: ${status} | Duration: ${duration}ms`, {
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Log API error
     */
    logApiError(method: string, url: string, status: number | string, message: string): void {
        this.error(`API ERROR: ${method} ${url} | Status: ${status}`, {
            message,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Log user event
     */
    logUserEvent(event: string, userId?: string): void {
        this.info(`USER EVENT: ${event}${userId ? ` | User: ${userId}` : ''}`, {
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Check if given level should be logged
     */
    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        const configLevelIndex = levels.indexOf(this.options.level);
        const currentLevelIndex = levels.indexOf(level);
        return currentLevelIndex >= configLevelIndex;
    }
}

// Export singleton instance
export const logger = new Logger();