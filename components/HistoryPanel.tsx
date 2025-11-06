
import React from 'react';
import type { ScanHistoryItem } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface HistoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
    history: ScanHistoryItem[];
    onSelect: (item: ScanHistoryItem) => void;
    onRefresh: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, history, onSelect, onRefresh }) => {
    
    const formatDate = (date: Date) => {
        if (!date) return 'Date not available';
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Scan History</h2>
                         <div className="flex items-center gap-2">
                            <button onClick={onRefresh} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Refresh history">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m-5.223 0a10.001 10.001 0 0016.954 3.733M20 20v-5h-5m-1.258 0a10.003 10.003 0 00-15.696-3.733" />
                                </svg>
                            </button>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Close history panel">
                                <XMarkIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                            </button>
                        </div>
                    </header>

                    <div className="flex-grow overflow-y-auto p-4 space-y-3">
                        {history.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-slate-500 dark:text-slate-400">No scan history found.</p>
                                <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Your scans will appear here.</p>
                            </div>
                        ) : (
                            history.map((item) => (
                                <div 
                                    key={item.id} 
                                    onClick={() => onSelect(item)}
                                    className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg cursor-pointer hover:bg-cyan-100 dark:hover:bg-cyan-900/40 border border-transparent hover:border-cyan-300 dark:hover:border-cyan-700 transition-all duration-200"
                                >
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate" title={item.symptoms}>
                                        {item.symptoms || 'Image-based scan'}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {formatDate(item.timestamp)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HistoryPanel;
