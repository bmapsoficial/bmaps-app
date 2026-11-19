// EXPERIMENTO (branch experimento/firebase-auth). Peças visuais das telas de acesso
// (entrar, criar conta, recuperar senha e confirmar e-mail).
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Rotulo, Tela, TituloGrafite } from '../components/Rua';
import { cores, coresSelecao, fontes, sombraAdesivo } from '../theme';

const logo = require('../../assets/logo.png');
// Proporção real do arquivo da logo oficial (900 × 546), para nunca distorcer.
const PROPORCAO_LOGO = 900 / 546;

// Laranja das ações de acesso (#F28C28) e grafite dos cards secundários (#48484D):
// as mesmas cores já usadas nos itens selecionados do app.
const LARANJA = coresSelecao.texto;
const GRAFITE = coresSelecao.fundo;

// Fundo urbano de sempre, com rolagem que se ajusta ao teclado do iPhone (os campos e
// botões sobem para não ficar escondidos) e respiro para a área segura de baixo.
// `compacta` (por enquanto só na tela Entrar): a tela só rola quando o conteúdo não cabe,
// então, sem teclado, ela fica parada no topo e a logo não é puxada para fora da vista.
export function TelaAcesso({ children, fundo = 0, compacta = false }) {
  const insets = useSafeAreaInsets();
  return (
    <Tela
      fundo={fundo}
      propsRolagem={{
        automaticallyAdjustKeyboardInsets: Platform.OS === 'ios',
        keyboardDismissMode: Platform.OS === 'ios' ? 'interactive' : 'on-drag',
        ...(compacta && {
          alwaysBounceVertical: false,
          contentInsetAdjustmentBehavior: 'never',
        }),
      }}
    >
      {children}
      <View style={{ height: insets.bottom }} />
    </Tela>
  );
}

// Volta para a tela anterior; se não houver (por exemplo, app aberto direto nesta tela),
// vai para a tela indicada.
export function voltarOu(rota) {
  if (router.canGoBack()) router.back();
  else router.replace(rota);
}

// Logo oficial centralizada no topo e, abaixo, o título da tela.
// `compacto` (por enquanto só na tela Entrar): logo com largura e altura calculadas em
// números exatos (metade da largura da tela, no máximo 200), sem depender de porcentagem,
// e título encostado na logo.
export function CabecalhoAcesso({ titulo, gotas = [0.08, 0.5, 0.92], compacto = false }) {
  const { width } = useWindowDimensions();
  const larguraLogo = Math.min(200, Math.round(width * 0.5));
  const estiloLogo = compacto
    ? { width: larguraLogo, height: Math.round(larguraLogo / PROPORCAO_LOGO) }
    : estilos.logo;
  return (
    <View style={compacto ? estilos.cabecalhoCompacto : estilos.cabecalho}>
      <Image
        source={logo}
        style={estiloLogo}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel="B-Maps Brasil"
      />
      <TituloGrafite
        tamanho={compacto ? 38 : 40}
        linhas={1}
        ajustar
        escalaMinima={0.5}
        centralizar
        gotas={gotas}
        estilo={compacto ? { marginBottom: 2 } : undefined}
      >
        {titulo}
      </TituloGrafite>
    </View>
  );
}

export function Campo({ rotulo, ...props }) {
  return (
    <View style={{ gap: 6 }}>
      <Rotulo cor={cores.textoSuave}>{rotulo}</Rotulo>
      <TextInput placeholderTextColor={cores.cinza} style={estilos.campo} {...props} />
    </View>
  );
}

// Ação principal da tela: bloco laranja cheio com sombra branca sólida.
export function BotaoPrincipal({ titulo, aoTocar, desativado = false }) {
  return (
    <Pressable
      onPress={aoTocar}
      disabled={desativado}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: desativado }}
      style={({ pressed }) => [
        estilos.botaoPrincipal,
        sombraAdesivo(cores.texto, 4),
        { opacity: desativado ? 0.45 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <Text style={estilos.botaoPrincipalTexto}>{titulo}</Text>
    </Pressable>
  );
}

// Ação secundária: card grafite com texto e contorno laranja; o card inteiro é tocável.
// `discreto` (por enquanto só na tela Entrar): sem contorno e sem sombra, mais baixo, para
// não competir com os campos e o botão principal.
export function CartaoAcao({
  titulo,
  icone = 'chevron-forward',
  aoTocar,
  desativado = false,
  discreto = false,
}) {
  const voltar = icone === 'arrow-back';
  return (
    <Pressable
      onPress={aoTocar}
      disabled={desativado}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: desativado }}
      style={({ pressed }) => [
        estilos.cartao,
        discreto ? estilos.cartaoDiscreto : sombraAdesivo('#000000', 3),
        { opacity: desativado ? 0.45 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      {voltar ? <Ionicons name={icone} size={discreto ? 18 : 20} color={LARANJA} /> : null}
      <Text style={[estilos.cartaoTexto, discreto && estilos.cartaoTextoDiscreto]}>{titulo}</Text>
      {voltar ? null : <Ionicons name={icone} size={discreto ? 18 : 20} color={LARANJA} />}
    </Pressable>
  );
}

// Grupo de cards secundários, um pouco afastado da ação principal.
export function AcoesSecundarias({ children }) {
  return <View style={estilos.secundarias}>{children}</View>;
}

export function Aviso({ children, tipo = 'info' }) {
  if (!children) return null;
  return (
    <Text
      style={[estilos.aviso, tipo === 'erro' && { color: '#FF8A80' }]}
      accessibilityLiveRegion="polite"
    >
      {children}
    </Text>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    alignItems: 'center',
    gap: 6,
  },
  cabecalhoCompacto: {
    alignItems: 'center',
    gap: 0,
    marginTop: 4,
  },
  logo: {
    width: '62%',
    maxWidth: 240,
    aspectRatio: PROPORCAO_LOGO,
  },
  campo: {
    minHeight: 48,
    borderWidth: 2,
    borderColor: cores.texto,
    backgroundColor: cores.fundo,
    color: cores.texto,
    paddingHorizontal: 12,
    fontFamily: fontes.marcador,
    fontSize: 16,
    ...sombraAdesivo('#000000', 3),
  },
  botaoPrincipal: {
    minHeight: 54,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: LARANJA,
    marginTop: 4,
  },
  botaoPrincipalTexto: {
    fontFamily: fontes.bloco,
    fontSize: 19,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: cores.fundo,
  },
  secundarias: {
    gap: 14,
    marginTop: 8,
  },
  cartao: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: GRAFITE,
    borderWidth: 2,
    borderColor: LARANJA,
  },
  cartaoDiscreto: {
    minHeight: 50,
    paddingVertical: 10,
    borderWidth: 0,
  },
  cartaoTextoDiscreto: {
    fontSize: 15,
  },
  cartaoTexto: {
    flex: 1,
    fontFamily: fontes.bloco,
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: LARANJA,
  },
  aviso: {
    fontFamily: fontes.texto,
    fontSize: 14,
    lineHeight: 20,
    color: cores.textoSuave,
  },
});
