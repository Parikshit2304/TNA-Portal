import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { SurveyList } from './pages/SurveyList';
import { SurveyDetail } from './pages/SurveyDetail';
import { CreateSurvey } from './pages/CreateSurvey';
import { Reports } from './pages/Reports';
import { Profile } from './pages/Profile';
import { TrainingApplication } from './pages/TrainingApplication';
import { TrainingApplicationList } from './pages/TrainingApplicationList';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/surveys" element={<SurveyList />} />
                      <Route path="/surveys/:id" element={<SurveyDetail />} />
                      <Route path="/create-survey" element={<CreateSurvey />} />
                      <Route path="/training-applications" element={<TrainingApplicationList />} />
                      <Route path="/apply-training" element={<TrainingApplication />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;