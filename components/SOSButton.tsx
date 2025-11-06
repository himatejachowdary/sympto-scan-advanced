
import React, { useState } from 'react';

const SOSButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-red-500 z-40"
        aria-label="Emergency SOS"
      >
        SOS
      </button>
      
      {isModalOpen && (
        <div 
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
            onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl border border-red-500/50 max-w-sm w-full mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-extrabold text-red-600 dark:text-red-500 mb-4">Emergency Information</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg">
              If this is a medical emergency, please call your local emergency number immediately.
            </p>
            <p className="text-5xl font-bold text-slate-900 dark:text-white tracking-widest mb-6 border-y-2 border-slate-200 dark:border-slate-700 py-4">
              911
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              (Or your country's respective emergency number, e.g., 112, 999)
            </p>
            <p className="font-semibold text-amber-600 dark:text-amber-400 mb-6">
              SymtoScan is for informational purposes and cannot provide assistance in emergencies.
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
