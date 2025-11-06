
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
            className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl border border-red-500/50 max-w-md w-full mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-extrabold text-red-600 dark:text-red-500 mb-4">Emergency Numbers (India)</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg">
              If this is a medical emergency, please call your local emergency number immediately.
            </p>
            
            <div className="mb-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">National Emergency Number</p>
                <p className="text-5xl font-bold text-slate-900 dark:text-white tracking-widest py-2">
                    112
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left mb-6 border-t-2 border-slate-200 dark:border-slate-700 pt-6">
                <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Ambulance:</p>
                    <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">102</p>
                </div>
                <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Police:</p>
                    <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">100</p>
                </div>
                <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Fire:</p>
                    <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">101</p>
                </div>
                <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Women's Helpline:</p>
                    <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">1091</p>
                </div>
            </div>
            
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
