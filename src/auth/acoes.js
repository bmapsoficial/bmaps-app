// EXPERIMENTO (branch experimento/firebase-auth).
// Ações de autenticação usadas pelas telas. Nenhuma tela fala direto com o Firebase.
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { auth } from './firebase';

const MENSAGENS = {
  'auth/email-already-in-use': 'Não foi possível criar a conta com esse e-mail.',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/weak-password': 'Senha fraca. Use uma senha mais longa e difícil de adivinhar.',
  'auth/password-does-not-meet-requirements': 'A senha não atende aos requisitos de segurança.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/user-disabled': 'Esta conta está desativada.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
  'auth/network-request-failed': 'Sem conexão. Verifique a internet e tente de novo.',
};

export function mensagemDeErro(erro) {
  return MENSAGENS[erro?.code] || 'Não foi possível concluir agora. Tente de novo.';
}

function exigirAuth() {
  if (!auth) throw Object.assign(new Error('Firebase não configurado'), { code: 'config' });
  return auth;
}

export async function cadastrar({ nome, email, senha }) {
  const { user } = await createUserWithEmailAndPassword(exigirAuth(), email.trim(), senha);
  await updateProfile(user, { displayName: nome.trim() });
  await sendEmailVerification(user);
  return user;
}

export function entrar({ email, senha }) {
  return signInWithEmailAndPassword(exigirAuth(), email.trim(), senha);
}

export function sair() {
  return signOut(exigirAuth());
}

export function reenviarConfirmacao() {
  const usuario = exigirAuth().currentUser;
  if (!usuario) return Promise.resolve();
  return sendEmailVerification(usuario);
}

// Sempre "sucesso" para a tela: a resposta não revela se o e-mail tem conta.
export async function recuperarSenha(email) {
  try {
    await sendPasswordResetEmail(exigirAuth(), email.trim());
  } catch (erro) {
    if (erro?.code === 'auth/too-many-requests' || erro?.code === 'auth/network-request-failed') {
      throw erro;
    }
  }
}

// Depois que a pessoa confirma o e-mail no navegador, o token antigo continua dizendo
// email_verified = false. É preciso recarregar o usuário e forçar um token novo.
export async function atualizarConfirmacao() {
  const usuario = exigirAuth().currentUser;
  if (!usuario) return false;
  await usuario.reload();
  if (usuario.emailVerified) await usuario.getIdToken(true);
  return usuario.emailVerified;
}
