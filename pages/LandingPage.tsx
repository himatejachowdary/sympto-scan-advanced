import React from 'react';
import { StethoscopeIcon } from '../components/icons/StethoscopeIcon';
import { BrainCircuitIcon } from '../components/icons/BrainCircuitIcon';
import { MapPinIcon } from '../components/icons/MapPinIcon';
import { MicrophoneIcon } from '../components/icons/MicrophoneIcon';

interface LandingPageProps {
    onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-50 dark:from-cyan-900/10 via-transparent to-transparent z-0"></div>
            <div className="relative z-10 flex flex-col items-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-5xl mx-auto">
                    <header className="flex items-center justify-between gap-3 py-4 w-full">
                        <div className="flex items-center justify-center gap-3">
                            <StethoscopeIcon className="h-8 w-8 text-cyan-500"/>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Symto<span className="text-cyan-500">Scan</span>
                            </h1>
                        </div>
                        <button
                            onClick={onGetStarted}
                            className="px-4 py-2 border border-transparent rounded-full text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors"
                        >
                            Log In / Sign Up
                        </button>
                    </header>

                    <main className="mt-16 sm:mt-24 text-center">
                        <div className="bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <StethoscopeIcon className="h-12 w-12 text-cyan-500"/>
                        </div>

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                            AI-Powered Symptom Analysis
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400">
                            Describe your symptoms, get instant preliminary insights, and discover nearby medical facilities. Your first step towards understanding your health.
                        </p>

                        <div className="mt-10">
                            <button
                                onClick={onGetStarted}
                                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-cyan-500"
                            >
                                Get Started
                            </button>
                        </div>
                    </main>

                    <section className="mt-24 sm:mt-32">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                                <div className="bg-cyan-100 dark:bg-cyan-900/50 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                                    <BrainCircuitIcon className="h-6 w-6 text-cyan-600 dark:text-cyan-300"/>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Instant AI Analysis</h3>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">Get a preliminary analysis of your symptoms in seconds from our advanced AI.</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                                <div className="bg-cyan-100 dark:bg-cyan-900/50 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                                    <MapPinIcon className="h-6 w-6 text-cyan-600 dark:text-cyan-300"/>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Find Nearby Care</h3>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">Locate hospitals, clinics, and pharmacies near you based on your needs.</p>
                            </div>
                             <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                                <div className="bg-cyan-100 dark:bg-cyan-900/50 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                                    <MicrophoneIcon className="h-6 w-6 text-cyan-600 dark:text-cyan-300"/>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Voice or Text Input</h3>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">Easily describe your symptoms using your voice or keyboard for accessibility.</p>
                            </div>
                        </div>
                    </section>

                    <footer className="text-center mt-24 text-sm text-slate-500 dark:text-slate-400">
                        <p className="font-semibold text-amber-600 dark:text-amber-400">Disclaimer: This tool does not provide medical advice. It is intended for informational purposes only.</p>
                        <p className="mt-2">&copy; {new Date().getFullYear()} SymtoScan. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
