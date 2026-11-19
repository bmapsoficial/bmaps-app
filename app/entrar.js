// EXPERIMENTO (branch experimento/firebase-auth). Tela de login.
import { useState } from 'react';
import { router } from 'expo-router';

import {
  AcoesSecundarias,
  Aviso,
  BotaoPrincipal,
  CabecalhoAcesso,
  Campo,
  CartaoAcao,
  TelaAcesso,
} from '../src/auth/Formulario';
import { entrar, mensagemDeErro } from '../src/auth/acoes';
import { configuracaoAusente } from '../src/auth/firebase';

export default function Entrar() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function aoEntrar() {
    setErro('');
    setEnviando(true);
    try {
      await entrar({ email, senha });
      // A troca de tela é feita pelo layout raiz, conforme o estado da sessão.
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <TelaAcesso compacta>
      <CabecalhoAcesso titulo="Entrar" gotas={[0.06, 0.55, 0.94]} compacto />
      {configuracaoAusente.length > 0 ? (
        <Aviso tipo="erro">
          Firebase não configurado. Falta no .env: {configuracaoAusente.join(', ')}.
        </Aviso>
      ) : null}
      <Campo
        rotulo="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="username"
        placeholder="voce@exemplo.com"
      />
      <Campo
        rotulo="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoComplete="current-password"
        textContentType="password"
        placeholder="Sua senha"
      />
      <Aviso tipo="erro">{erro}</Aviso>
      <BotaoPrincipal
        titulo={enviando ? 'Entrando…' : 'Entrar'}
        aoTocar={aoEntrar}
        desativado={enviando || !email || !senha}
      />
      <AcoesSecundarias>
        <CartaoAcao
          titulo="Esqueci minha senha"
          aoTocar={() => router.push('/recuperar-senha')}
          discreto
        />
        <CartaoAcao titulo="Criar uma conta" aoTocar={() => router.push('/cadastrar')} discreto />
      </AcoesSecundarias>
    </TelaAcesso>
  );
}
