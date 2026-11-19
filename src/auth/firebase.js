// EXPERIMENTO (branch experimento/firebase-auth).
//
// Inicialização do Firebase Authentication (SDK JavaScript, compatível com Expo Go).
// A configuração vem de variáveis EXPO_PUBLIC_* num arquivo .env que NÃO vai para o
// Git (veja .env.example). Esses valores identificam o projeto Firebase e não são
// segredos; a proteção real fica nas regras do Firebase e na validação do Worker.
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';

import { armazenamentoSeguro } from './armazenamentoSeguro';

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const configuracaoAusente = Object.entries(config)
  .filter(([, valor]) => !valor)
  .map(([nome]) => nome);

function criarAuth() {
  if (configuracaoAusente.length > 0) return null;
  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  try {
    // A sessão fica no Keychain/Keystore (armazenamentoSeguro), nunca no AsyncStorage.
    return initializeAuth(app, { persistence: getReactNativePersistence(armazenamentoSeguro) });
  } catch (erro) {
    // Recarregamento rápido do Expo: o Auth já foi inicializado nesta sessão do JS.
    if (erro?.code === 'auth/already-initialized') return getAuth(app);
    throw erro;
  }
}

export const auth = criarAuth();

// E-mails de confirmação/recuperação e a página de ações do Firebase em português.
if (auth) auth.languageCode = 'pt-BR';
