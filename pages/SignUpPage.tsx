import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { StethoscopeIcon } from '../components/icons/StethoscopeIcon';
import { getFirebaseAuthErrorMessage } from '../utils/firebaseErrors';

interface SignUpPageProps {
    onSwitchView: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSwitchView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Auth state change will be handled by the AuthContext provider
        } catch (err: any) {
            const errorMessage = getFirebaseAuthErrorMessage(err.code || '');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
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
                    <h2 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">Create Account</h2>
                    <form onSubmit={handleSignUp} className="space-y-6">
                        <div>
                            <label htmlFor="email-signup" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                            <input
                                id="email-signup"
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
                            <label htmlFor="password-signup" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                            <input
                                id="password-signup"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                            />
                        </div>

                        {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                            >
                                {isLoading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                        Already have an account?{' '}
                        <button onClick={onSwitchView} className="font-medium text-cyan-600 hover:text-cyan-500 focus:outline-none focus:underline">
                            Log In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;