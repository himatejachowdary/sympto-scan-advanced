import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileData: UserProfile) => void;
  initialProfile: UserProfile | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSave, initialProfile }) => {
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');

  // Use useEffect to sync state with prop changes, especially when the modal reopens.
  useEffect(() => {
    if (isOpen) {
      setDisplayName(initialProfile?.displayName || '');
      setAge(initialProfile?.age?.toString() || '');
    }
  }, [isOpen, initialProfile]);


  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNumber = parseInt(age, 10);

    if (!displayName.trim()) {
        alert('Please enter a display name.');
        return;
    }

    if (!isNaN(ageNumber) && ageNumber > 0 && ageNumber < 120) {
      onSave({
        displayName: displayName.trim(),
        age: ageNumber,
      });
    } else {
      alert('Please enter a valid age.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-center mb-2 text-slate-900 dark:text-white">Your Profile</h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-6">Keeping your profile updated helps tailor the analysis.</p>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Display Name</label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., Jane Doe"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              required
              min="1"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 35"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;