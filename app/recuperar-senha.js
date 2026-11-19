// EXPERIMENTO (branch experimento/firebase-auth). Recuperação de senha por e-mail.
// A mensagem é a mesma exista ou não conta com o e-mail (não revela quem é usuário).
import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { router } from 'expo-router';

import { BotaoAdesivo, Tela, TituloGrafite } from '../src/components/Rua';
import { Aviso, Campo } from '../src/auth/Formulario';
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
    <Tela>
      <TituloGrafite tamanho={40} linhas={1} ajustar gotas={[0.05, 0.5, 0.95]}>
        Nova senha
      </TituloGrafite>
      <Campo
        rotulo="E-mail da conta"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder="voce@exemplo.com"
      />
      <Aviso>{aviso}</Aviso>
      <Aviso tipo="erro">{erro}</Aviso>
      <BotaoAdesivo
        titulo={enviando ? 'Enviando…' : 'Enviar link'}
        aoTocar={aoEnviar}
        desativado={enviando || !email}
        largo
      />
      <Pressable onPress={() => router.back()} accessibilityRole="link">
        <Text style={estilos.link}>Voltar</Text>
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
