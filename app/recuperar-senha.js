// EXPERIMENTO (branch experimento/firebase-auth). Recuperação de senha por e-mail.
// A mensagem é a mesma exista ou não conta com o e-mail (não revela quem é usuário).
import { useState } from 'react';
import { Text } from 'react-native';

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
import { mensagemDeErro, recuperarSenha } from '../src/auth/acoes';
import { cores, fontes } from '../src/theme';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [aviso, setAviso] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar() {
    setErro('');
    setAviso('');
    setEnviando(true);
    try {
      await recuperarSenha(email);
      setAviso(
        'Se houver uma conta com esse e-mail, enviamos um link para criar uma nova senha. Confira também o spam.',
      );
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <TelaAcesso compacta>
      <CabecalhoAcesso titulo="Recuperar senha" compacto />
      <Text style={estilos.explicacao}>
        Informe o e-mail que você usou no cadastro. Vamos enviar um link para você criar uma nova
        senha.
      </Text>
      <Campo
        rotulo="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder="voce@exemplo.com"
      />
      <Aviso>{aviso}</Aviso>
      <Aviso tipo="erro">{erro}</Aviso>
      <BotaoPrincipal
        titulo={enviando ? 'Enviando…' : 'Enviar link'}
        aoTocar={aoEnviar}
        desativado={enviando || !email}
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

const estilos = {
  explicacao: {
    fontFamily: fontes.texto,
    fontSize: 15,
    lineHeight: 22,
    color: cores.textoSuave,
    textAlign: 'center',
    // Aproxima o texto do título; o espaço até o campo segue o padrão da tela.
    marginTop: -6,
  },
};
