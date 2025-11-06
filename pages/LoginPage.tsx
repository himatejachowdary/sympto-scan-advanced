import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { StethoscopeIcon } from '../components/icons/StethoscopeIcon';
import { getFirebaseAuthErrorMessage } from '../utils/firebaseErrors';

interface LoginPageProps {
    onSwitchView: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState<string | null>(null);
    const [resetError, setResetError] = useState<string | null>(null);
    const [isSendingReset, setIsSendingReset] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Auth state change will be handled by the AuthContext provider
        } catch (err: any) {
            const errorMessage = getFirebaseAuthErrorMessage(err.code || '');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendPasswordReset = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setResetMessage(null);
        setResetError(null);
        setIsSendingReset(true);
        try {
            const targetEmail = (resetEmail || email).trim();
            if (!targetEmail) {
                setResetError('Please enter an email address before requesting a password reset.');
                return;
            }
            await sendPasswordResetEmail(auth, targetEmail);
            setResetMessage('Password reset email sent. Please check your inbox.');
        } catch (err: any) {
            const errorMessage = getFirebaseAuthErrorMessage(err.code || '');
            setResetError(errorMessage);
        } finally {
            setIsSendingReset(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <header className="flex items-center justify-center gap-3 mb-8">
                    <StethoscopeIcon className="h-10 w-10 text-cyan-500" />
                    <h1 className="text-4xl sm:text-5xl font-bold text-center text-slate-900 dark:text-white tracking-tight">
                        Symto<span className="text-cyan-500">Scan</span>
                    </h1>
                </header>

                <div className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">Log In</h2>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="password"  className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                            />
                        </div>

                        {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}

                        <div className="mt-2 text-right">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowReset((s) => {
                                        const nextState = !s;
                                        if (nextState) {
                                            setResetEmail(email);
                                        } else {
                                            setResetEmail('');
                                        }
                                        return nextState;
                                    });
                                    setResetMessage(null);
                                    setResetError(null);
                                }}
                                className="text-sm text-cyan-600 hover:text-cyan-500 focus:outline-none"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                            >
                                {isLoading ? 'Logging in...' : 'Log In'}
                            </button>
                        </div>
                    </form>

                    {showReset && (
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600">
                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="resetEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email for reset</label>
                                    <input
                                        id="resetEmail"
                                        name="resetEmail"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        required
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                    />
                                </div>

                                {(resetError || resetMessage) && (
                                    <p className={`text-sm text-center ${resetError ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-300'}`}>{resetError ?? resetMessage}</p>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleSendPasswordReset()}
                                        disabled={isSendingReset}
                                        className="flex-1 py-2 px-4 rounded-md text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-400"
                                    >
                                        {isSendingReset ? 'Sending...' : 'Send reset email'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowReset(false);
                                            setResetEmail('');
                                            setResetMessage(null);
                                            setResetError(null);
                                        }}
                                        className="flex-1 py-2 px-4 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                        Don't have an account?{' '}
                        <button onClick={onSwitchView} className="font-medium text-cyan-600 hover:text-cyan-500 focus:outline-none focus:underline">
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;