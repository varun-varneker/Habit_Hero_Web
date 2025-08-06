import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export const login = async ({ email, password }) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signup = async ({ email, password }) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export async function logout() {
  await auth.signOut();
}

export async function deleteAccount() {
  if (auth.currentUser) {
    await auth.currentUser.delete();
  }
}