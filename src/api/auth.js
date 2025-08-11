import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, deleteUser } from 'firebase/auth';

export function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export async function deleteAccount() {
  const user = auth.currentUser;
  if (user) {
    await deleteUser(user);
  }
}