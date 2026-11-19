// EXPERIMENTO (branch experimento/firebase-auth). Tela de diagnóstico do protótipo:
// mostra o estado da sessão e do token para os testes no iPhone. Não mostra o token.
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

import { BotaoAdesivo, Tela, TituloGrafite } from '../src/components/Rua';
import { Aviso } from '../src/auth/Formulario';
import { mensagemDeErro, sair } from '../src/auth/acoes';
import { armazenamentoSeguro } from '../src/auth/armazenamentoSeguro';
import { auth } from '../src/auth/firebase';
import { cores, fontes } from '../src/theme';

const hora = (texto) => (texto ? new Date(texto).toLocaleString('pt-BR') : '—');

export default function SessaoTeste() {
  const [info, setInfo] = useState(null);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async (forcarRenovacao = false) => {
    setErro('');
    try {
      const usuario = auth?.currentUser;
      if (!usuario) return;
      const resultado = await usuario.getIdTokenResult(forcarRenovacao);
      // Confere se a sessão está de fato no Keychain (sem exibir o conteúdo).
      const guardada = await armazenamentoSeguro.getItem(
        `firebase:authUser:${auth.app.options.apiKey}:${auth.app.name}`,
      );
      setInfo({
        uid: usuario.uid,
        email: usuario.email,
        nome: usuario.displayName,
        confirmado: resultado.claims.email_verified === true,
        provedor: resultado.signInProvider,
        emitido: hora(resultado.issuedAtTime),
        expira: hora(resultado.expirationTime),
        autenticado: hora(resultado.authTime),
        noKeychain: guardada ? `sim (${guardada.length} caracteres)` : 'não encontrada',
      });
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }, []);

  useEffect(() => {
    carregar(false);
  }, [carregar]);

  const linhas = info
    ? [
        ['UID', info.uid],
        ['E-mail', info.email],
        ['Nome', info.nome || '—'],
        ['E-mail confirmado (token)', info.confirmado ? 'sim' : 'não'],
        ['Provedor', info.provedor],
        ['Token emitido', info.emitido],
        ['Token expira', info.expira],
        ['Login feito em', info.autenticado],
        ['Sessão no Keychain', info.noKeychain],
      ]
    : [];

  return (
    <Tela>
      <Pressable onPress={() => router.back()} accessibilityRole="button">
        <Text style={estilos.voltar}>‹ Voltar</Text>
      </Pressable>
      <TituloGrafite tamanho={40} linhas={1} ajustar gotas={[0.05, 0.5, 0.95]}>
        Sessão (teste)
      </TituloGrafite>
      <View style={{ gap: 10 }}>
        {linhas.map(([rotulo, valor]) => (
          <View key={rotulo}>
            <Text style={estilos.rotulo}>{rotulo}</Text>
            <Text style={estilos.valor} selectable>
              {valor}
            </Text>
          </View>
        ))}
      </View>
      <Aviso tipo="erro">{erro}</Aviso>
      <BotaoAdesivo titulo="Forçar renovação do token" aoTocar={() => carregar(true)} largo />
      <BotaoAdesivo
        titulo="Sair"
        variante="contorno"
        aoTocar={() => sair().catch(() => {})}
        largo
      />
    </Tela>
  );
}

const estilos = {
  voltar: { fontFamily: fontes.bloco, fontSize: 16, color: cores.laranja, paddingVertical: 8 },
  rotulo: {
    fontFamily: fontes.bloco,
    fontSize: 12,
    letterSpacing: 1,
    color: cores.textoSuave,
    textTransform: 'uppercase',
  },
  valor: { fontFamily: fontes.texto, fontSize: 15, color: cores.texto },
};
