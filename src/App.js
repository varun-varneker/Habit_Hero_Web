import './App.css';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignupForm from './components/Signup';
import Dashboard from './components/Dashboard';
import CharacterCreation from './components/CharacterCreation';
import QuestBoardPage from './components/QuestBoardPage';
import CharacterProfile from './components/CharacterProfile';
import SettingsPage from './components/SettingsPage';
import AchievementsPage from './components/AchievementsPage';

function App() {
  const user = useSelector(state => state.user);
  const profile = useSelector(state => state.profile);
  const [showLogin, setShowLogin] = useState(true);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            user ? (
              // User is logged in
              profile && profile.name && profile.name.trim() !== '' ? (
                // User has completed character creation
                <Navigate to="/dashboard" replace />
              ) : (
                // User exists but hasn't completed character creation
                <Navigate to="/character-creation" replace />
              )
            ) : (
              // User is not logged in - show login/signup
              showLogin ? (
                <Login onSwitch={() => setShowLogin(false)} />
              ) : (
                <SignupForm onSwitch={() => setShowLogin(true)} />
              )
            )
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            user && profile && profile.name && profile.name.trim() !== '' ? (
              <Dashboard />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/character-creation" 
          element={
            user ? (
              profile && profile.name && profile.name.trim() !== '' ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <CharacterCreation />
              )
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/quests" 
          element={
            user && profile && profile.name && profile.name.trim() !== '' ? (
              <QuestBoardPage />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            user && profile && profile.name && profile.name.trim() !== '' ? (
              <CharacterProfile />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/achievements" 
          element={
            user && profile && profile.name && profile.name.trim() !== '' ? (
              <AchievementsPage />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            user && profile && profile.name && profile.name.trim() !== '' ? (
              <SettingsPage />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
