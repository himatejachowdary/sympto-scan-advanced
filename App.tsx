import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MainPage from './pages/MainPage';
import LandingPage from './pages/LandingPage';
import FullScreenLoader from './components/FullScreenLoader';

const AppContent: React.FC = () => {
    const { user, loading } = useAuth();
    const [showLanding, setShowLanding] = useState(true);
    const [isLoginView, setIsLoginView] = useState(true);

    // If a user is logged in, they should never see the landing page.
    // This effect ensures that we move past the landing page once the user state is confirmed.
    useEffect(() => {
        if (user) {
            setShowLanding(false);
        }
    }, [user]);

    if (loading) {
        return <FullScreenLoader />;
    }
    
    // If we have a user, show the main application.
    if (user) {
        return <MainPage />;
    }
    
    // If there's no user and we're meant to show the landing page, show it.
    if (showLanding) {
        return <LandingPage onGetStarted={() => setShowLanding(false)} />;
    }

    // Otherwise, show the login/signup forms.
    return isLoginView 
        ? <LoginPage onSwitchView={() => setIsLoginView(false)} /> 
        : <SignUpPage onSwitchView={() => setIsLoginView(true)} />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;