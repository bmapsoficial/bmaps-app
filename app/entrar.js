// EXPERIMENTO (branch experimento/firebase-auth). Tela de login.
import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { router } from 'expo-router';

import { BotaoAdesivo, Tela, TituloGrafite } from '../src/components/Rua';
import { Aviso, Campo } from '../src/auth/Formulario';
import { entrar, mensagemDeErro } from '../src/auth/acoes';
import { configuracaoAusente } from '../src/auth/firebase';
import { cores, fontes } from '../src/theme';

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
    <Tela>
      <TituloGrafite tamanho={42} gotas={[0.06, 0.55, 0.94]}>
        Entrar
      </TituloGrafite>
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
      <BotaoAdesivo
        titulo={enviando ? 'Entrando…' : 'Entrar'}
        aoTocar={aoEntrar}
        desativado={enviando || !email || !senha}
        largo
      />
      <Pressable onPress={() => router.push('/recuperar-senha')} accessibilityRole="link">
        <Text style={estilos.link}>Esqueci minha senha</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/cadastrar')} accessibilityRole="link">
        <Text style={estilos.link}>Ainda não tenho conta — cadastrar</Text>
      </Pressable>
    </Tela>
  );
}

const estilos = {
  link: {
    fontFamily: fontes.bloco,
    fontSize: 15,
    letterSpacing: 1,
    color: cores.laranja,
    textTransform: 'uppercase',
    paddingVertical: 10,
  },
};
