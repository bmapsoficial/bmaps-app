// EXPERIMENTO (branch experimento/firebase-auth).
// Estado da sessão para o app inteiro: carregando, usuário e se o e-mail foi confirmado.
import { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { onIdTokenChanged } from 'firebase/auth';

import { atualizarConfirmacao } from './acoes';
import { auth } from './firebase';

const ContextoSessao = createContext({ carregando: true, usuario: null, emailConfirmado: false });

export function ProvedorSessao({ children }) {
  const [estado, setEstado] = useState({
    carregando: !!auth,
    usuario: null,
    emailConfirmado: false,
  });

  // onIdTokenChanged cobre entrar, sair e cada renovação do token (a cada ~1 hora).
  useEffect(() => {
    if (!auth) return undefined;
    return onIdTokenChanged(auth, (usuario) => {
      setEstado({ carregando: false, usuario, emailConfirmado: !!usuario?.emailVerified });
    });
  }, []);

  // Ao voltar para o app (ex.: depois de confirmar o e-mail no navegador), consulta o
  // Firebase de novo se o e-mail ainda constar como não confirmado.
  useEffect(() => {
    const assinatura = AppState.addEventListener('change', (situacao) => {
      const usuario = auth?.currentUser;
      if (situacao === 'active' && usuario && !usuario.emailVerified) {
        atualizarConfirmacao().catch(() => {});
      }
    });
    return () => assinatura.remove();
  }, []);

  return <ContextoSessao.Provider value={estado}>{children}</ContextoSessao.Provider>;
}

export function useSessao() {
  return useContext(ContextoSessao);
}
