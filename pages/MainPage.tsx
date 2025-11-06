import React, { useState, useCallback, useEffect } from 'react';
import type { Coordinates, Place } from '../types';
import { analyzeSymptoms, findNearbyMedicalFacilities } from '../services/geminiService';
import SymptomInput from '../components/SymptomInput';
import AnalysisResult from '../components/AnalysisResult';
import NearbyPlaces from '../components/NearbyPlaces';
import Loader from '../components/Loader';
import { StethoscopeIcon } from '../components/icons/StethoscopeIcon';
import AuthDetails from '../components/AuthDetails';

// Fix for TypeScript errors: Property 'SpeechRecognition' and 'webkitSpeechRecognition' do not exist on type 'Window'.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const MainPage: React.FC = () => {
  const [symptoms, setSymptoms] = useState<string>('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  
  const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = speechRecognition ? new speechRecognition() : null;

  const getLocation = (): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          () => {
            reject(new Error('Unable to retrieve your location. Please enable location services.'));
          }
        );
      }
    });
  };

  const handleScan = async () => {
    if (!symptoms.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setPlaces([]);

    try {
      const analysisPromise = analyzeSymptoms(symptoms);
      
      let location: Coordinates | null = null;
      try {
        location = await getLocation();
      } catch (locationError: any) {
        setError(locationError.message);
      }

      const placesPromise = location ? findNearbyMedicalFacilities(symptoms, location) : Promise.resolve([]);
      
      const [analysisResult, placesResult] = await Promise.all([analysisPromise, placesPromise]);

      setAnalysis(analysisResult);
      setPlaces(placesResult);

    } catch (err: any) {
      setError(`An error occurred: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = useCallback(() => {
    if (!recognition) {
        setError("Speech recognition is not supported in this browser.");
        return;
    }
    if (isListening) {
        recognition.stop();
        setIsListening(false);
    } else {
        recognition.start();
    }
  }, [recognition, isListening]);

  useEffect(() => {
    if (!recognition) return;

    recognition.onstart = () => {
        setIsListening(true);
    };

    recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('');
        setSymptoms(transcript);
    };

    recognition.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
    };

    recognition.onend = () => {
        setIsListening(false);
    };
    
    return () => {
        recognition.abort();
    };
  }, [recognition]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="flex items-center justify-between gap-3 mb-8 w-full">
          <div className="flex items-center justify-center gap-3">
            <StethoscopeIcon className="h-10 w-10 text-cyan-500"/>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              Symto<span className="text-cyan-500">Scan</span>
            </h1>
          </div>
          <AuthDetails />
        </header>

        <main className="flex flex-col gap-8">
          <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
             <p className="text-center text-slate-600 dark:text-slate-400 mb-4">
              Describe your symptoms below using your voice or keyboard. Our AI will provide preliminary information and help find nearby medical facilities.
            </p>
            <SymptomInput
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              onScan={handleScan}
              onVoiceInput={handleVoiceInput}
              isListening={isListening}
              isLoading={isLoading}
            />
          </div>

          {isLoading && <Loader />}

          {error && (
             <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-xl relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {analysis && (
              <div className="lg:col-span-3">
                 <AnalysisResult analysisText={analysis} />
              </div>
            )}
            {places.length > 0 && (
              <div className={analysis ? "lg:col-span-2" : "lg:col-span-5"}>
                <NearbyPlaces places={places} />
              </div>
            )}
          </div>
        </main>

         <footer className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400">
            <p>&copy; {new Date().getFullYear()} SymtoScan. All rights reserved.</p>
            <p className="mt-1">This tool does not provide medical advice. It is intended for informational purposes only.</p>
        </footer>
      </div>
    </div>
  );
};

export default MainPage;
