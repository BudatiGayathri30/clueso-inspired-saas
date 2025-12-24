import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WorkspaceProvider, useWorkspace } from './contexts/WorkspaceContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WorkspaceSetup from './pages/WorkspaceSetup';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Videos from './pages/Videos';
import Documentation from './pages/Documentation';
import AIInsights from './pages/AIInsights';
import Settings from './pages/Settings';
import CreateVideo from './pages/CreateVideo';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { currentWorkspace, loading: workspaceLoading } = useWorkspace();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showCreateVideo, setShowCreateVideo] = useState(false);

  useEffect(() => {
    if (user && currentWorkspace) {
      setCurrentPage('dashboard');
    }
  }, [user, currentWorkspace]);

  if (authLoading || (user && workspaceLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl font-bold text-white">C</span>
          </div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authView === 'login') {
      return (
        <Login
          onSwitchToSignup={() => setAuthView('signup')}
          onLoginSuccess={() => {}}
        />
      );
    }
    return (
      <Signup
        onSwitchToLogin={() => setAuthView('login')}
        onSignupSuccess={() => {}}
      />
    );
  }

  if (user && !currentWorkspace) {
    return <WorkspaceSetup onComplete={() => window.location.reload()} />;
  }

  const handleCreateVideo = () => {
    setShowCreateVideo(true);
  };

  const handleVideoComplete = (videoId: string) => {
    setShowCreateVideo(false);
    setCurrentPage('videos');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} onCreateVideo={handleCreateVideo} />;
      case 'videos':
        return <Videos onCreateVideo={handleCreateVideo} onVideoSelect={(id) => console.log('Video selected:', id)} />;
      case 'documentation':
        return <Documentation onDocumentSelect={(id) => console.log('Document selected:', id)} />;
      case 'ai-insights':
        return <AIInsights />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentPage} onCreateVideo={handleCreateVideo} />;
    }
  };

  return (
    <>
      <DashboardLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </DashboardLayout>

      {showCreateVideo && (
        <CreateVideo
          onClose={() => setShowCreateVideo(false)}
          onComplete={handleVideoComplete}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <AppContent />
      </WorkspaceProvider>
    </AuthProvider>
  );
}

export default App;
