// EXPERIMENTO (branch experimento/firebase-auth). Conta criada, e-mail ainda não confirmado.
// A pessoa abre o link no e-mail (página do Firebase no navegador) e volta ao app.
// O app verifica sozinho ao voltar (Sessao.js) ou pelo botão abaixo.
import { useState } from 'react';
import { Text } from 'react-native';

import { BotaoAdesivo, CartaoPapel, Tela, TituloGrafite } from '../src/components/Rua';
import { Aviso } from '../src/auth/Formulario';
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
    <Tela>
      <TituloGrafite tamanho={40} linhas={1} ajustar gotas={[0.05, 0.5, 0.95]}>
        Confirme o e-mail
      </TituloGrafite>
      <CartaoPapel>
        <Text style={estilos.texto}>
          Enviamos um link para {usuario?.email}. Abra o e-mail, toque no link e depois volte para o
          B-MAPS.
        </Text>
      </CartaoPapel>
      <Aviso>{aviso}</Aviso>
      <Aviso tipo="erro">{erro}</Aviso>
      <BotaoAdesivo
        titulo="Já confirmei"
        aoTocar={() =>
          executar(atualizarConfirmacao, (ok) =>
            ok ? '' : 'Ainda não aparece como confirmado. Abra o link do e-mail e tente de novo.',
          )
        }
        desativado={ocupado}
        largo
      />
      <BotaoAdesivo
        titulo="Reenviar e-mail"
        variante="contorno"
        aoTocar={() =>
          executar(reenviarConfirmacao, () => 'E-mail reenviado. Confira também o spam.')
        }
        desativado={ocupado}
        largo
      />
      <BotaoAdesivo
        titulo="Sair"
        variante="contorno"
        aoTocar={() => executar(sair)}
        desativado={ocupado}
        largo
      />
    </Tela>
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
