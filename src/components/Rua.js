// Peças visuais da versão rua do B-Maps, reaproveitadas em todas as telas.
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cores, fontes, sombraAdesivo } from '../theme';

// Respingos de tinta decorativos espalhados no fundo da tela.
const RESPINGOS = [
  { top: 180, left: 330, size: 3, cor: cores.texto, opacity: 0.15 },
  { top: 320, left: 20, size: 4, cor: cores.laranja, opacity: 0.25 },
  { top: 460, left: 300, size: 6, cor: cores.laranja, opacity: 0.2 },
  { top: 600, left: 120, size: 3, cor: cores.texto, opacity: 0.12 },
  { top: 720, left: 350, size: 4, cor: cores.laranja, opacity: 0.3 },
];

export function Tela({ children, rolagem = true }) {
  const Conteudo = rolagem ? ScrollView : View;
  const propsConteudo = rolagem
    ? { contentContainerStyle: estilos.conteudo, keyboardShouldPersistTaps: 'handled' }
    : { style: [estilos.conteudo, { flex: 1 }] };

  return (
    <SafeAreaView style={estilos.tela} edges={['top']}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {RESPINGOS.map((r, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              top: r.top,
              left: r.left,
              width: r.size,
              height: r.size,
              borderRadius: r.size / 2,
              backgroundColor: r.cor,
              opacity: r.opacity,
            }}
          />
        ))}
      </View>
      <Conteudo {...propsConteudo}>{children}</Conteudo>
    </SafeAreaView>
  );
}

// Título em letra de grafite, laranja, inclinado, com escorridos de tinta.
export function TituloGrafite({ children, tamanho = 46, escorridos = true }) {
  return (
    <View style={{ marginBottom: escorridos ? 18 : 6 }}>
      {/* A altura de linha precisa ser maior que o tamanho da fonte: a letra de grafite
          (Sedgwick Ave Display) é mais alta que o normal e, com a linha justa (1,05),
          o iOS cortava o topo das letras, como o "O" de "O que tá rolando". */}
      <Text style={[estilos.tituloGrafite, { fontSize: tamanho, lineHeight: tamanho * 1.3 }]}>
        {children}
      </Text>
      {escorridos && (
        <View pointerEvents="none" style={estilos.escorridos}>
          <View style={[estilos.gota, { left: 20, height: 16 }]} />
          <View style={[estilos.gota, { left: 104, height: 24, width: 5 }]} />
          <View style={[estilos.gota, { left: 210, height: 12, width: 4 }]} />
        </View>
      )}
    </View>
  );
}

// Rótulo pequeno em letra de bloco (ex.: "TREINO · HOJE 19H").
export function Rotulo({ children, cor = cores.laranja, estilo }) {
  return <Text style={[estilos.rotulo, { color: cor }, estilo]}>{children}</Text>;
}

// Botão estilo adesivo. Variantes: laranja (ação), verde (confirmar presença), contorno.
export function BotaoAdesivo({
  titulo,
  aoTocar,
  variante = 'laranja',
  inclinacao = 0,
  desativado = false,
  largo = false,
  rotuloAcessivel,
}) {
  const fundo =
    variante === 'laranja' ? cores.laranja : variante === 'verde' ? cores.verde : 'transparent';
  const corTexto = variante === 'contorno' ? cores.texto : cores.fundo;

  return (
    <Pressable
      onPress={aoTocar}
      disabled={desativado}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel || titulo}
      accessibilityState={{ disabled: desativado }}
      style={({ pressed }) => [
        estilos.botao,
        {
          backgroundColor: fundo,
          borderWidth: variante === 'contorno' ? 2 : 0,
          borderColor: cores.texto,
          transform: [{ rotate: `${inclinacao}deg` }, { scale: pressed ? 0.97 : 1 }],
          opacity: desativado ? 0.45 : 1,
          alignSelf: largo ? 'stretch' : 'flex-start',
        },
        variante !== 'contorno' && sombraAdesivo(cores.texto),
      ]}
    >
      <Text style={[estilos.botaoTexto, { color: corTexto }]}>{titulo}</Text>
    </Pressable>
  );
}

// Etiqueta selecionável (filtros, tipo de publicação, papéis na cena).
export function Etiqueta({
  titulo,
  ativa,
  aoTocar,
  inclinacao = 0,
  corAtiva = cores.laranja,
  corTextoAtiva = cores.fundo,
}) {
  return (
    <Pressable
      onPress={aoTocar}
      accessibilityRole="button"
      accessibilityState={{ selected: !!ativa }}
      style={[
        estilos.etiqueta,
        ativa
          ? [{ backgroundColor: corAtiva, borderColor: corAtiva }, sombraAdesivo(cores.texto, 2)]
          : { backgroundColor: cores.fundo, borderColor: cores.texto },
        { transform: [{ rotate: `${inclinacao}deg` }] },
      ]}
    >
      <Text style={[estilos.etiquetaTexto, { color: ativa ? corTextoAtiva : cores.texto }]}>
        {titulo}
      </Text>
    </Pressable>
  );
}

// Cartão de papel colado com fita (estilo lambe-lambe).
export function CartaoPapel({ children, inclinacao = -1 }) {
  return (
    <View style={[estilos.papel, { transform: [{ rotate: `${inclinacao}deg` }] }]}>
      <View style={estilos.fita} />
      {children}
    </View>
  );
}

// Aviso de "ainda não tem nada aqui" — nunca mostramos conteúdo inventado.
export function EstadoVazio({ titulo, texto, acao, aoTocarAcao }) {
  return (
    <CartaoPapel>
      <Text style={estilos.vazioTitulo}>{titulo}</Text>
      {texto ? <Text style={estilos.vazioTexto}>{texto}</Text> : null}
      {acao ? (
        <View style={{ marginTop: 14 }}>
          <BotaoAdesivo titulo={acao} aoTocar={aoTocarAcao} inclinacao={-2} />
        </View>
      ) : null}
    </CartaoPapel>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 18,
  },
  tituloGrafite: {
    fontFamily: fontes.grafite,
    color: cores.laranja,
    transform: [{ rotate: '-3deg' }],
    textShadowColor: '#000000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  escorridos: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -14,
    height: 26,
  },
  gota: {
    position: 'absolute',
    top: 0,
    width: 6,
    backgroundColor: cores.laranja,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  rotulo: {
    fontFamily: fontes.bloco,
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  botao: {
    minHeight: 46,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoTexto: {
    fontFamily: fontes.bloco,
    fontSize: 17,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  etiqueta: {
    minHeight: 40,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  etiquetaTexto: {
    fontFamily: fontes.bloco,
    fontSize: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  papel: {
    backgroundColor: cores.papel,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
  },
  fita: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -39,
    width: 78,
    height: 20,
    backgroundColor: 'rgba(200,200,190,0.8)',
    transform: [{ rotate: '3deg' }],
  },
  vazioTitulo: {
    fontFamily: fontes.bloco,
    fontSize: 22,
    lineHeight: 26,
    color: cores.textoPapel,
    textTransform: 'uppercase',
  },
  vazioTexto: {
    fontFamily: fontes.texto,
    fontSize: 15,
    lineHeight: 21,
    color: '#333333',
    marginTop: 6,
  },
});
