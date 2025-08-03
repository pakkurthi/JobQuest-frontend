import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import JobFormPage from './pages/JobFormPage';
import MyJobsPage from './pages/MyJobsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ProviderApplicationsPage from './pages/ProviderApplicationsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

// Protected route component for routes that require authentication
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Show loading state while checking auth
  if (loading) {
    return <div className="d-flex justify-content-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Protected route specifically for Job Providers
const JobProviderRoute = ({ children }) => {
  const { user, loading, isJobProvider } = useAuth();
  
  if (loading) {
    return <div className="d-flex justify-content-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }
  
  if (!user || !isJobProvider()) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Protected route specifically for Job Seekers
const JobSeekerRoute = ({ children }) => {
  const { user, loading, isJobSeeker } = useAuth();
  
  if (loading) {
    return <div className="d-flex justify-content-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }
  
  if (!user || !isJobSeeker()) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:id" element={<JobDetailsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
            
            {/* Job Provider Routes */}
            <Route path="my-jobs" element={
              <JobProviderRoute>
                <MyJobsPage />
              </JobProviderRoute>
            } />
            <Route path="post-job" element={
              <JobProviderRoute>
                <JobFormPage />
              </JobProviderRoute>
            } />
            <Route path="edit-job/:id" element={
              <JobProviderRoute>
                <JobFormPage />
              </JobProviderRoute>
            } />
            <Route path="applications-management" element={
              <JobProviderRoute>
                <ProviderApplicationsPage />
              </JobProviderRoute>
            } />
            
            {/* Job Seeker Routes */}
            <Route path="my-applications" element={
              <JobSeekerRoute>
                <MyApplicationsPage />
              </JobSeekerRoute>
            } />
            
            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
