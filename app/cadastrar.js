// EXPERIMENTO (branch experimento/firebase-auth). Cadastro com nome, e-mail e senha.
// A política de senha vale de verdade no Firebase (configurada no console); aqui só
// evitamos enviar o formulário obviamente incompleto.
import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { router } from 'expo-router';

import { BotaoAdesivo, Tela, TituloGrafite } from '../src/components/Rua';
import { Aviso, Campo } from '../src/auth/Formulario';
import { cadastrar, mensagemDeErro } from '../src/auth/acoes';
import { cores, fontes } from '../src/theme';

export default function Cadastrar() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function aoCadastrar() {
    setErro('');
    if (senha !== confirmacao) {
      setErro('As senhas não conferem.');
      return;
    }
    setEnviando(true);
    try {
      await cadastrar({ nome, email, senha });
      // Conta criada e e-mail enviado: o layout raiz leva para "Confirme seu e-mail".
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Tela>
      <TituloGrafite tamanho={42} gotas={[0.05, 0.5, 0.95]}>
        Cadastrar
      </TituloGrafite>
      <Campo
        rotulo="Nome"
        value={nome}
        onChangeText={setNome}
        autoComplete="name"
        placeholder="Seu nome"
      />
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
        autoComplete="new-password"
        textContentType="newPassword"
        placeholder="Crie uma senha"
      />
      <Campo
        rotulo="Repita a senha"
        value={confirmacao}
        onChangeText={setConfirmacao}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        placeholder="Repita a senha"
      />
      <Aviso tipo="erro">{erro}</Aviso>
      <BotaoAdesivo
        titulo={enviando ? 'Criando…' : 'Criar conta'}
        aoTocar={aoCadastrar}
        desativado={enviando || !nome.trim() || !email || !senha || !confirmacao}
        largo
      />
      <Pressable onPress={() => router.back()} accessibilityRole="link">
        <Text style={estilos.link}>Já tenho conta — entrar</Text>
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
