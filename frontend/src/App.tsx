import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppLayout } from './layouts/AppLayout';
import { AuthPage } from './pages/AuthPage';
import { InboxPage } from './pages/InboxPage';
import { TaskListPage } from './pages/TaskListPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { BiometricsPage } from './pages/BiometricsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/app/inbox" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicRoute><AuthPage /></PublicRoute>} />
        
        <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/app/inbox" replace />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="tasks" element={<TaskListPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="biometrics" element={<BiometricsPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
