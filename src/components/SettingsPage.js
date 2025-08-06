import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../api/auth'; // You should have this function

export default function SettingsPage() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logout();
    dispatch({ type: 'LOGOUT' });
  };

  const handleDeleteAccount = async () => {
    // Implement account deletion logic here
    alert('Account deletion not implemented yet.');
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Settings</h2>
      <button onClick={handleLogout} style={{ marginRight: 16 }}>Logout</button>
      <button onClick={handleDeleteAccount} style={{ color: 'red' }}>Delete Account</button>
    </div>
  );
}