import './App.css';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignupForm from './components/Signup';
import Dashboard from './components/Dashboard';
import CharacterCreation from './components/CharacterCreation';
import QuestBoardPage from './components/QuestBoardPage';
import CharacterProfile from './components/CharacterProfile';
import SettingsPage from './components/SettingsPage';
import { auth } from './api/firebase';
import { loadUserData } from './api/userData';

function App() {
  const user = useSelector(state => state.user);
  const profile = useSelector(state => state.profile);
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        dispatch({ type: 'SET_USER', payload: { uid: userAuth.uid, email: userAuth.email } });
        const userData = await loadUserData(userAuth.uid);
        if (userData) {
          if (userData.profile) dispatch({ type: 'UPDATE_PROFILE', payload: userData.profile });
          if (userData.stats) dispatch({ type: 'UPDATE_STATS', payload: userData.stats });
          if (userData.quests) dispatch({ type: 'SET_QUESTS', payload: userData.quests });
          if (userData.achievements) dispatch({ type: 'SET_ACHIEVEMENTS', payload: userData.achievements });
          if (userData.inventory) dispatch({ type: 'SET_INVENTORY', payload: userData.inventory });
          if (userData.streaks) dispatch({ type: 'SET_STREAKS', payload: userData.streaks });
          if (userData.friends) dispatch({ type: 'SET_FRIENDS', payload: userData.friends });
          if (userData.friendRequests) dispatch({ type: 'SET_FRIEND_REQUESTS', payload: userData.friendRequests });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)', color: 'white', fontFamily: 'Poppins' }}>
        <h2>Loading Your Hero...</h2>
      </div>
    );
  }

  return (
    <Router>
      <div className="App" style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontFamily: 'Poppins, Arial, sans-serif',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        <Routes>
          <Route path="/character-creation" element={user ? <CharacterCreation /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={user && profile && profile.name ? <Dashboard /> : <Navigate to={user ? "/character-creation" : "/"} />} />
          <Route path="/quests" element={user && profile && profile.name ? <QuestBoardPage /> : <Navigate to={user ? "/character-creation" : "/"} />} />
          <Route path="/profile" element={<CharacterProfile />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={
            user
              ? (profile && profile.name ? <Navigate to="/dashboard" /> : <Navigate to="/character-creation" />)
              : (
                  <header className="App-header" style={{ 
                  background: 'rgba(255,255,255,0.18)', 
                  borderRadius: 24, 
                  padding: '32px 24px', 
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', 
                  minWidth: 320, 
                  maxWidth: 420, 
                  width: '100%', 
                  backdropFilter: 'blur(8px)', 
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <img
                      src="https://imgs.search.brave.com/jbw-PNX4yuozhwRORDd7hZJyZTV6-vkxnQB6KMPmZNs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVpaWsuY29tLzI1/Ni8xMzA5Ny8xMzA5/NzY1OS5wbmc_c2Vt/dD1haXNfaHlicmlk"
                      alt="Habit Hero"
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: 'contain',
                        marginBottom: 8,
                        filter: 'drop-shadow(0 2px 8px #7b2ff2)'
                      }}
                    />
                    <h1 style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, fontSize: 24, margin: 0 }}>Habit Hero</h1>
                    <p style={{ color: '#f3e9ff', fontSize: 14, marginTop: 8, marginBottom: 0 }}>Build better habits, one day at a time.</p>
                  </div>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                      <button
                        onClick={() => setShowLogin(true)}
                        style={{
                          background: showLogin ? '#7b2ff2' : 'transparent',
                          color: showLogin ? '#fff' : '#7b2ff2',
                          border: '2px solid #7b2ff2',
                          borderRadius: '16px 0 0 16px',
                          padding: '8px 24px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          outline: 'none',
                          fontSize: 14,
                          transition: 'all 0.2s',
                          boxShadow: showLogin ? '0 2px 8px #7b2ff2aa' : 'none',
                        }}
                      >
                        Login
                      </button>
                      <button
                        onClick={() => setShowLogin(false)}
                        style={{
                          background: !showLogin ? '#7b2ff2' : 'transparent',
                          color: !showLogin ? '#fff' : '#7b2ff2',
                          border: '2px solid #7b2ff2',
                          borderRadius: '0 16px 16px 0',
                          padding: '8px 24px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          outline: 'none',
                          fontSize: 14,
                          transition: 'all 0.2s',
                          boxShadow: !showLogin ? '0 2px 8px #7b2ff2aa' : 'none',
                        }}
                      >
                        Sign Up
                      </button>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.13)', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px #7b2ff2aa', marginBottom: 8 }}>
                      {showLogin ? <Login /> : <SignupForm />}
                    </div>
                  </div>
                </header>
              )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
