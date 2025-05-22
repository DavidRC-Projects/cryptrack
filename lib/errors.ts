export class CryptoAPIError extends Error {
  constructor(
    message: string,
    public type: 'NETWORK' | 'RATE_LIMIT' | 'NOT_FOUND' | 'INVALID_DATA' | 'SERVER_ERROR' | 'UNKNOWN',
    public statusCode?: number,
    public originalError?: unknown,
    public retryAttempt: number = 0
  ) {
    super(message)
    this.name = 'CryptoAPIError'
  }

  static fromError(error: unknown, retryAttempt: number = 0): CryptoAPIError {
    if (error instanceof CryptoAPIError) {
      return new CryptoAPIError(
        error.message,
        error.type,
        error.statusCode,
        error.originalError,
        retryAttempt
      )
    }

    if (error instanceof Error) {
      // Network errors
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return new CryptoAPIError(
          'Unable to connect to the server. Please check your internet connection.',
          'NETWORK',
          undefined,
          error,
          retryAttempt
        )
      }

      // Rate limit errors
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        return new CryptoAPIError(
          'API rate limit exceeded. Please try again in a few minutes.',
          'RATE_LIMIT',
          429,
          error,
          retryAttempt
        )
      }

      // Not found errors
      if (error.message.includes('not found') || error.message.includes('404')) {
        return new CryptoAPIError(
          'The requested cryptocurrency data could not be found.',
          'NOT_FOUND',
          404,
          error,
          retryAttempt
        )
      }

      // Invalid data errors
      if (error.message.includes('invalid') || error.message.includes('400')) {
        return new CryptoAPIError(
          'Invalid data received from the server. Please try again later.',
          'INVALID_DATA',
          400,
          error,
          retryAttempt
        )
      }

      // Server errors
      if (error.message.includes('500') || error.message.includes('server')) {
        return new CryptoAPIError(
          'Server error occurred. Our team has been notified.',
          'SERVER_ERROR',
          500,
          error,
          retryAttempt
        )
      }
    }

    // Unknown errors
    return new CryptoAPIError(
      'An unexpected error occurred. Please try again later.',
      'UNKNOWN',
      undefined,
      error,
      retryAttempt
    )
  }

  get userMessage(): string {
    switch (this.type) {
      case 'NETWORK':
        return 'Connection Error: Unable to connect to the server. Please check your internet connection and try again.'
      case 'RATE_LIMIT':
        return 'Rate Limit: We\'ve hit our API limit. Please wait a few minutes before trying again.'
      case 'NOT_FOUND':
        return 'Not Found: The cryptocurrency you\'re looking for doesn\'t exist or has been removed.'
      case 'INVALID_DATA':
        return 'Data Error: We received invalid data from the server. Please try again later.'
      case 'SERVER_ERROR':
        return 'Server Error: Something went wrong on our end. Our team has been notified.'
      case 'UNKNOWN':
      default:
        return 'Unexpected Error: Something went wrong. Please try again later.'
    }
  }

  get shouldRetry(): boolean {
    return ['NETWORK', 'RATE_LIMIT', 'SERVER_ERROR'].includes(this.type) && this.retryAttempt < 3
  }

  get retryAfter(): number {
    const MAX_RETRY_DELAY = 30000 // 30 seconds
    const BASE_DELAY: Record<typeof this.type, number> = {
      'RATE_LIMIT': 60000, // 1 minute
      'NETWORK': 2000,    // 2 seconds
      'SERVER_ERROR': 5000, // 5 seconds
      'NOT_FOUND': 0,     // No retry for not found
      'INVALID_DATA': 0,  // No retry for invalid data
      'UNKNOWN': 0        // No retry for unknown errors
    }

    // Exponential backoff with jitter
    const exponentialDelay = BASE_DELAY[this.type] * Math.pow(2, this.retryAttempt)
    const jitter = Math.random() * 1000 // Add up to 1 second of random jitter
    return Math.min(exponentialDelay + jitter, MAX_RETRY_DELAY)
  }

  get retryState(): {
    canRetry: boolean
    nextRetryIn: number
    maxRetries: number
    retryCount: number
  } {
    return {
      canRetry: this.shouldRetry,
      nextRetryIn: this.retryAfter,
      maxRetries: 3,
      retryCount: this.retryAttempt
    }
  }

  incrementRetry(): CryptoAPIError {
    return new CryptoAPIError(
      this.message,
      this.type,
      this.statusCode,
      this.originalError,
      this.retryAttempt + 1
    )
  }
} 