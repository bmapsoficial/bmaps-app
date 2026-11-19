// EXPERIMENTO (branch experimento/firebase-auth). Conta criada, e-mail ainda não confirmado.
// A pessoa abre o link no e-mail (página do Firebase no navegador) e volta ao app.
// O app verifica sozinho ao voltar (Sessao.js) ou pelo botão abaixo.
import { useState } from 'react';
import { Text } from 'react-native';

import { CartaoPapel } from '../src/components/Rua';
import {
  AcoesSecundarias,
  Aviso,
  BotaoPrincipal,
  CabecalhoAcesso,
  CartaoAcao,
  TelaAcesso,
} from '../src/auth/Formulario';
import { atualizarConfirmacao, mensagemDeErro, reenviarConfirmacao, sair } from '../src/auth/acoes';
import { useSessao } from '../src/auth/Sessao';
import { cores, fontes } from '../src/theme';

export default function ConfirmarEmail() {
  const { usuario } = useSessao();
  const [aviso, setAviso] = useState('');
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);

  async function executar(acao, sucesso) {
    setErro('');
    setAviso('');
    setOcupado(true);
    try {
      const resultado = await acao();
      if (sucesso) setAviso(sucesso(resultado));
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setOcupado(false);
    }
  }

  return (
    <TelaAcesso>
      <CabecalhoAcesso titulo="Confirme o e-mail" />
      <CartaoPapel>
        <Text style={estilos.texto}>
          Enviamos um link para {usuario?.email}. Abra o e-mail, toque no link e depois volte para o
          B-MAPS.
        </Text>
      </CartaoPapel>
      <Aviso>{aviso}</Aviso>
      <Aviso tipo="erro">{erro}</Aviso>
      <BotaoPrincipal
        titulo="Já confirmei"
        aoTocar={() =>
          executar(atualizarConfirmacao, (ok) =>
            ok ? '' : 'Ainda não aparece como confirmado. Abra o link do e-mail e tente de novo.',
          )
        }
        desativado={ocupado}
      />
      <AcoesSecundarias>
        <CartaoAcao
          titulo="Reenviar e-mail"
          icone="mail-outline"
          aoTocar={() =>
            executar(reenviarConfirmacao, () => 'E-mail reenviado. Confira também o spam.')
          }
          desativado={ocupado}
        />
        <CartaoAcao
          titulo="Sair"
          icone="log-out-outline"
          aoTocar={() => executar(sair)}
          desativado={ocupado}
        />
      </AcoesSecundarias>
    </TelaAcesso>
  );
}

const estilos = {
  texto: {
    fontFamily: fontes.texto,
    fontSize: 15,
    lineHeight: 21,
    color: cores.textoPapel,
  },
};
