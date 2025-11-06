import React from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const AuthDetails: React.FC = () => {
    const { user } = useAuth();

    const handleSignOut = () => {
        signOut(auth).catch((error) => console.error("Sign out error", error));
    };

    if (!user) {
        return null;
    }

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block truncate" title={user.email ?? 'User'}>
                {user.email}
            </span>
            <button
                onClick={handleSignOut}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors"
            >
                Sign Out
            </button>
        </div>
    );
};

export default AuthDetails;
