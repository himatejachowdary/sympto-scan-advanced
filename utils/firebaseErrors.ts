/**
 * Translates Firebase Auth error codes into user-friendly messages.
 * @param errorCode The error code from the Firebase Auth error object.
 * @returns A user-friendly error message string.
 */
export const getFirebaseAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'The email address is not valid. Please check the format.';
    case 'auth/user-disabled':
      return 'This user account has been disabled by an administrator.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please log in.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled. Please enable it in the Firebase console under Authentication > Sign-in method.';
    case 'auth/weak-password':
      return 'The password is too weak. It must be at least 6 characters long.';
    case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
    case 'auth/too-many-requests':
        return 'Access to this account has been temporarily disabled due to many failed login attempts. You can try again later.';
    case 'auth/invalid-credential':
        return 'The credential provided is invalid. Please check your email and password.'
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.': // Handling the exact error from the logs
        return 'Invalid Firebase API Key. Please check your firebaseConfig.ts file and ensure it contains a valid configuration from your Firebase project.';
    default:
      console.error('Unhandled Firebase Auth Error:', errorCode);
      return 'An unexpected error occurred. Please try again.';
  }
};
