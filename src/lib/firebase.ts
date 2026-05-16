import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Log de diagnóstico para ajudar o usuário a verificar se as variáveis da Vercel estão chegando
if (import.meta.env.PROD) {
  const isConfigValid = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'mock-key';
  console.log('🔥 [Firebase Diagnostics]:', isConfigValid ? 'Configuração carregada com sucesso.' : '⚠️ AVISO: Usando chaves genéricas! Verifique as variáveis de ambiente na Vercel.');
  if (!isConfigValid) {
    console.warn('As variáveis devem começar com VITE_FIREBASE_*');
  }
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;

