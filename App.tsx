import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MainPage from './pages/MainPage';
import FullScreenLoader from './components/FullScreenLoader';

const AppContent: React.FC = () => {
    const { user, loading } = useAuth();
    const [isLoginView, setIsLoginView] = useState(true);

    if (loading) {
        return <FullScreenLoader />;
    }

    if (user) {
        return <MainPage />;
    }

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