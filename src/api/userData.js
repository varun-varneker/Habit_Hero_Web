import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function saveUserData(uid, data) {
  try {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
}

export async function loadUserData(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null; // Return null on error to prevent app crashes
  }
}
