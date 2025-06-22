import './App.css';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignupForm from './components/Signup';
import Dashboard from './components/Dashboard';
import CharacterCreation from './components/CharacterCreation';

function App() {
  const user = useSelector(state => state.user);
  const profile = useSelector(state => state.profile);
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="App" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, Arial, sans-serif' }}>
      <Routes>
        <Route path="/character-creation" element={user ? <CharacterCreation /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={user && profile && profile.name ? <Dashboard /> : <Navigate to={user ? "/character-creation" : "/"} />} />
        <Route path="/" element={
          user
            ? (profile && profile.name ? <Navigate to="/dashboard" /> : <Navigate to="/character-creation" />)
            : (
              <header className="App-header" style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 24, padding: 48, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', minWidth: 380, maxWidth: 420, width: '100%', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <img
                    src="https://imgs.search.brave.com/jbw-PNX4yuozhwRORDd7hZJyZTV6-vkxnQB6KMPmZNs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni8xMzA5Ny8xMzA5/NzY1OS5wbmc_c2Vt/dD1haXNfaHlicmlk"
                    alt="Habit Hero"
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: 'contain',
                      marginBottom: 8,
                      filter: 'drop-shadow(0 2px 8px #7b2ff2)'
                    }}
                  />
                  <h1 style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, fontSize: 32, margin: 0 }}>Habit Hero</h1>
                  <p style={{ color: '#f3e9ff', fontSize: 16, marginTop: 8, marginBottom: 0 }}>Build better habits, one day at a time.</p>
                </div>
                <div style={{ minWidth: 340 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                    <button
                      onClick={() => setShowLogin(true)}
                      style={{
                        background: showLogin ? '#7b2ff2' : 'transparent',
                        color: showLogin ? '#fff' : '#7b2ff2',
                        border: '2px solid #7b2ff2',
                        borderRadius: '20px 0 0 20px',
                        padding: '10px 32px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        outline: 'none',
                        fontSize: 16,
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
                        borderRadius: '0 20px 20px 0',
                        padding: '10px 32px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        outline: 'none',
                        fontSize: 16,
                        transition: 'all 0.2s',
                        boxShadow: !showLogin ? '0 2px 8px #7b2ff2aa' : 'none',
                      }}
                    >
                      Sign Up
                    </button>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.13)', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px #7b2ff2aa', marginBottom: 8 }}>
                    {showLogin ? <Login /> : <SignupForm />}
                  </div>
                </div>
              </header>
            )
        } />
      </Routes>
    </div>
  );
}

export default App;
