// EXPERIMENTO (branch experimento/firebase-auth). Cadastro com nome, e-mail e senha.
// A política de senha vale de verdade no Firebase (configurada no console); aqui só
// evitamos enviar o formulário obviamente incompleto.
import { useState } from 'react';
import {
  AcoesSecundarias,
  Aviso,
  BotaoPrincipal,
  CabecalhoAcesso,
  Campo,
  CartaoAcao,
  TelaAcesso,
  voltarOu,
} from '../src/auth/Formulario';
import { cadastrar, mensagemDeErro } from '../src/auth/acoes';

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
    <TelaAcesso compacta>
      <CabecalhoAcesso titulo="Criar uma conta" compacto />
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
        rotulo="Repetir senha"
        value={confirmacao}
        onChangeText={setConfirmacao}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        placeholder="Repita a senha"
      />
      <Aviso tipo="erro">{erro}</Aviso>
      <BotaoPrincipal
        titulo={enviando ? 'Criando…' : 'Criar conta'}
        aoTocar={aoCadastrar}
        desativado={enviando || !nome.trim() || !email || !senha || !confirmacao}
      />
      <AcoesSecundarias>
        <CartaoAcao
          titulo="Voltar"
          icone="arrow-back"
          aoTocar={() => voltarOu('/entrar')}
          discreto
        />
      </AcoesSecundarias>
    </TelaAcesso>
  );
}
