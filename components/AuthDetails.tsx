
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { UserCircleIcon } from './icons/UserCircleIcon';


interface AuthDetailsProps {
    onProfileClick: () => void;
}

const AuthDetails: React.FC<AuthDetailsProps> = ({ onProfileClick }) => {
    const { user } = useAuth();

    const handleSignOut = () => {
        signOut(auth).catch((error) => console.log('Sign out error', error));
    };

    if (!user) {
        return null;
    }

    return (
        <div className="flex items-center gap-3">
             <button 
                onClick={onProfileClick} 
                className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                aria-label="Open profile settings"
            >
                <UserCircleIcon className="h-6 w-6" />
                <span className="hidden sm:inline">{user.displayName || user.email}</span>
            </button>
            <button 
                onClick={handleSignOut}
                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
            >
                Sign Out
            </button>
        </div>
    );
};

export default AuthDetails;
