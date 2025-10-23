import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import MainPage from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import AuthPage from './pages/AuthPage';
import ClubDetailPage from './pages/ClubDetailPage';
import MyClubPage from './pages/MyClubPage';
import ClubCreationPage from './pages/ClubCreationPage';
import { useAuth } from './hooks/useAuth';
import RecommendationPage from './pages/RecommendationPage';

function App() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/" replace /> : <AuthPage />} 
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/club/:clubId" element={<ClubDetailPage />} />
          <Route path="/my-club" element={<MyClubPage />} />
          <Route path="/create-club" element={<ClubCreationPage />} />
          <Route path="/recommend" element={<RecommendationPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;