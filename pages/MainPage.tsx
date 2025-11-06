
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { analyzeSymptoms, findNearbyMedicalFacilities } from '../services/geminiService';
import { getUserProfile, updateUserProfile, addScanToHistory, getScanHistory } from '../firebase/firestoreService';
import type { Coordinates, Place, CapturedImage, UserProfile, ScanHistoryItem } from '../types';
import { blobToBase64 } from '../utils/imageUtils';

import SymptomInput from '../components/SymptomInput';
import AnalysisResult from '../components/AnalysisResult';
import NearbyPlaces from '../components/NearbyPlaces';
import Loader from '../components/Loader';
import AuthDetails from '../components/AuthDetails';
import SOSButton from '../components/SOSButton';
import ProfileModal from '../components/ProfileModal';
import HistoryPanel from '../components/HistoryPanel';
import { StethoscopeIcon } from '../components/icons/StethoscopeIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import ThemeToggle from '../components/ThemeToggle';


const MainPage: React.FC = () => {
    const { user } = useAuth();
    const [symptoms, setSymptoms] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [places, setPlaces] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<Coordinates | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
    const [isListening, setIsListening] = useState(false);
    const IMAGE_LIMIT = 3;

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
    const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);


    // Fetch user profile
    useEffect(() => {
        if (user) {
            getUserProfile(user.uid).then(profile => {
                if (profile) {
                    setUserProfile(profile);
                } else {
                    // If no profile exists, prompt user to create one
                    setIsProfileModalOpen(true);
                }
            });
        }
    }, [user]);
    
    // Get user location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setLocationError(null);
            },
            (err) => {
                console.error("Geolocation error:", err);
                setLocationError("Could not get your location. Nearby facilities search will be disabled.");
            }
        );
    }, []);

    const handleSpeechRecognition = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in your browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setSymptoms(prev => prev ? `${prev} ${transcript}` : transcript);
        };

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    const handleScan = async () => {
        if (!symptoms.trim() && capturedImages.length === 0) {
            setError("Please enter symptoms or provide an image.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis('');
        setPlaces([]);

        try {
            const analysisResult = await analyzeSymptoms(symptoms, userProfile?.age || null, capturedImages);
            setAnalysis(analysisResult);

            if (location) {
                const nearbyFacilities = await findNearbyMedicalFacilities(symptoms, location);
                setPlaces(nearbyFacilities);
            }
            
            // Save to history
            if (user) {
                const historyItem = {
                    symptoms,
                    analysis: analysisResult,
                    images: capturedImages,
                    ageAtScan: userProfile?.age || null,
                };
                await addScanToHistory(user.uid, historyItem);
            }

        } catch (err) {
            console.error(err);
            setError("An error occurred during the analysis. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleImageCapture = async (files: FileList) => {
        if (capturedImages.length + files.length > IMAGE_LIMIT) {
            setError(`You can only upload a maximum of ${IMAGE_LIMIT} images.`);
            return;
        }

        try {
            const newImagesPromises = Array.from(files).map(async (file) => {
                const base64Data = await blobToBase64(file);
                return {
                    mimeType: file.type,
                    data: base64Data,
                };
            });

            const newImages = await Promise.all(newImagesPromises);
            setCapturedImages(prev => [...prev, ...newImages]);

        } catch (error) {
            console.error("Error converting files to base64:", error);
            setError("Could not process the captured images.");
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setCapturedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };
    
    const handleSaveProfile = async (profileData: UserProfile) => {
        if (user) {
            try {
                // Update Firebase Auth profile displayName
                await updateProfile(user, {
                    displayName: profileData.displayName
                });
                
                // Update Firestore profile document (which stores age)
                await updateUserProfile(user.uid, user.email!, profileData);

                setUserProfile(profileData);
                setIsProfileModalOpen(false);
            } catch (error) {
                console.error("Failed to save profile:", error);
                alert("Could not save your profile. Please try again.");
            }
        }
    };
    
    const fetchHistory = useCallback(async () => {
        if (user) {
            const history = await getScanHistory(user.uid);
            setScanHistory(history);
        }
    }, [user]);

    const handleHistoryClick = () => {
        if (!isHistoryPanelOpen) {
            fetchHistory();
        }
        setIsHistoryPanelOpen(!isHistoryPanelOpen);
    };
    
    const handleSelectHistoryItem = (item: ScanHistoryItem) => {
        setSymptoms(item.symptoms);
        setAnalysis(item.analysis);
        setCapturedImages(item.images || []);
        setPlaces([]); // Places are location-dependent, don't restore them
        setIsHistoryPanelOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-br from-cyan-100 to-transparent dark:from-cyan-900/20 z-0"></div>
            
            <div className="relative z-10">
                <header className="p-4 flex justify-between items-center max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                         <StethoscopeIcon className="h-8 w-8 text-cyan-500" />
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Symto<span className="text-cyan-500">Scan</span>
                        </h1>
                    </div>
                     <div className="flex items-center gap-2 sm:gap-4">
                        <ThemeToggle />
                        <button 
                            onClick={handleHistoryClick} 
                            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            aria-label="View scan history"
                        >
                            <ClockIcon className="h-6 w-6 text-slate-600 dark:text-slate-300"/>
                        </button>
                        <AuthDetails onProfileClick={() => setIsProfileModalOpen(true)} />
                    </div>
                </header>

                <main className="max-w-7xl mx-auto p-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Hello, {userProfile?.displayName || 'there'}!
                        </h2>
                        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Describe your symptoms below to get a preliminary AI analysis.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto mb-8">
                         <SymptomInput
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            onScan={handleScan}
                            onVoiceInput={handleSpeechRecognition}
                            isListening={isListening}
                            isLoading={isLoading}
                            onImageCapture={handleImageCapture}
                            onRemoveImage={handleRemoveImage}
                            capturedImages={capturedImages}
                        />
                        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
                         {locationError && <p className="text-amber-600 mt-2 text-center">{locationError}</p>}
                    </div>

                    {isLoading && <Loader />}

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                        {analysis && (
                             <div className="lg:col-span-3">
                                <AnalysisResult analysisText={analysis} />
                            </div>
                        )}
                        {places.length > 0 && (
                            <div className="lg:col-span-2">
                                <NearbyPlaces places={places} />
                            </div>
                        )}
                    </div>
                </main>
            </div>
            
            <SOSButton />
            
            <ProfileModal 
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onSave={handleSaveProfile}
                initialProfile={userProfile}
            />
            
            <HistoryPanel
                isOpen={isHistoryPanelOpen}
                onClose={() => setIsHistoryPanelOpen(false)}
                history={scanHistory}
                onSelect={handleSelectHistoryItem}
                onRefresh={fetchHistory}
            />
        </div>
    );
};

export default MainPage;