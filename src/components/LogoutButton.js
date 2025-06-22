import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../api/auth';

export default function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch({ type: 'LOGOUT' });
    } catch (err) {
      alert('Logout failed.');
    }
  };

  return (
    <button onClick={handleLogout} style={styles.button}>
      Logout
    </button>
  );
}

const styles = {
  button: {
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    background: '#d32f2f',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '16px',
  },
};
