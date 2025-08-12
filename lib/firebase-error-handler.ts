// lib/firebase-error-handler.ts - Firebase error handling utilities

export interface FirebaseErrorInfo {
  code: string;
  message: string;
  userFriendlyMessage: string;
  shouldRetry: boolean;
  retryDelay?: number;
}

export function handleFirebaseError(error: any): FirebaseErrorInfo {
  const errorCode = error?.code || 'unknown';
  const errorMessage = error?.message || 'Unknown Firebase error';

  switch (errorCode) {
    // Firestore errors
    case 'permission-denied':
      return {
        code: errorCode,
        message: errorMessage,
        userFriendlyMessage: 'Access denied. Please check your permissions.',
        shouldRetry: false
      };

    case 'unauthenticated':
      return {
        code: errorCode,
        message: errorMessage,
        userFriendlyMessage: 'Please sign in to continue.',
        shouldRetry: false
      };

    case 'unavailable':
      return {
        code: errorCode,
        message: errorMessage,
        userFriendlyMessage: 'Service temporarily unavailable. Please try again.',
        shouldRetry: true,
        retryDelay: 5000
      };

    case 'deadline-exceeded':
      return {
        code: errorCode,
        message: errorMessage,
        userFriendlyMessage: 'Request timed out. Please try again.',
        shouldRetry: true,
        retryDelay: 3000
      };

    case 'resource-exhausted':
      return {
        code: errorCode,
        message: errorMessage,
        userFriendlyMessage: 'Service limit reached. Please try again later.',
        shouldRetry: true,
        retryDelay: 10000
      };

    case 'failed-precondition':
      return {
        code: errorCode,
        message: errorMessage,
        userFriendlyMessage: 'Invalid operation. Please refresh and try again.',
        shouldRetry: false
      };

    case 'aborted':
      return {
        code: errorCode,
        message: errorMessage,
        userFriendlyMessage: 'Operation was cancelled.',
        shouldRetry: false
      };

    case 'out-of-range':
      return {
        code: errorCode,
        message: errorMessage,
        userFriendlyMessage: 'Invalid data provided.',
        shouldRetry: false
      };

    case 'unimplemented':
      return {
        code: errorCode,
        message: errorMessage,
        userFriendlyMessage: 'Feature not available.',
        shouldRetry: false
      };

    case 'internal':
      return {
        code: errorCode,
        message: errorMessage,
        userFriendlyMessage: 'Internal server error. Please try again.',
        shouldRetry: true,
        retryDelay: 5000
      };

    case 'data-loss':
      return {
        code: errorCode,
        message: errorMessage,
        userFriendlyMessage: 'Data loss occurred. Please refresh.',
        shouldRetry: false
      };

    // Network errors
    case 'network-error':
      return {
        code: errorCode,
        message: errorMessage,
        userFriendlyMessage: 'Network error. Please check your connection.',
        shouldRetry: true,
        retryDelay: 3000
      };

    // Default case
    default:
      return {
        code: errorCode,
        message: errorMessage,
        userFriendlyMessage: 'An unexpected error occurred. Please try again.',
        shouldRetry: true,
        retryDelay: 5000
      };
  }
}

export function isFirebaseError(error: any): boolean {
  return error && (
    error.code ||
    error.message?.includes('Firebase') ||
    error.message?.includes('Firestore') ||
    error.message?.includes('permission-denied') ||
    error.message?.includes('unauthenticated')
  );
}

export function shouldRetryFirebaseOperation(error: any): boolean {
  const errorInfo = handleFirebaseError(error);
  return errorInfo.shouldRetry;
}

export function getRetryDelay(error: any): number {
  const errorInfo = handleFirebaseError(error);
  return errorInfo.retryDelay || 5000;
}

export function logFirebaseError(error: any, context: string = 'Firebase operation') {
  const errorInfo = handleFirebaseError(error);
  
  console.group(`🚨 ${context} Error`);
  console.error('Error Code:', errorInfo.code);
  console.error('Error Message:', errorInfo.message);
  console.error('User Message:', errorInfo.userFriendlyMessage);
  console.error('Should Retry:', errorInfo.shouldRetry);
  if (errorInfo.retryDelay) {
    console.error('Retry Delay:', errorInfo.retryDelay + 'ms');
  }
  console.error('Full Error:', error);
  console.groupEnd();

  return errorInfo;
}
