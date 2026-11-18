// Peças visuais da versão rua do B-Maps, reaproveitadas em todas as telas.
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cores, fontes, sombraAdesivo } from '../theme';

// Texturas de spray (pacote de texturas do projeto, reduzidas e pintadas no laranja oficial).
// O bloco "rasgado" é branco para ser tingido com tintColor em qualquer cor de categoria.
const TEXTURAS = {
  ruas: require('../../assets/texturas/ruas.png'),
  papelLinhas: require('../../assets/texturas/papel-linhas.png'),
  pincel: require('../../assets/texturas/pincel.png'),
  faixa: require('../../assets/texturas/faixa.png'),
  bloco: require('../../assets/texturas/bloco.png'),
  respingos: [
    require('../../assets/texturas/respingo-1.png'),
    require('../../assets/texturas/respingo-2.png'),
    require('../../assets/texturas/respingo-3.png'),
    require('../../assets/texturas/respingo-4.png'),
  ],
};
// Escorridos e a proporção altura/largura de cada um (para não distorcer).
const GOTAS = [
  { fonte: require('../../assets/texturas/gota-5.png'), proporcao: 86 / 40 },
  { fonte: require('../../assets/texturas/gota-2.png'), proporcao: 69 / 48 },
  { fonte: require('../../assets/texturas/gota-4.png'), proporcao: 62 / 48 },
  { fonte: require('../../assets/texturas/gota-1.png'), proporcao: 81 / 48 },
  { fonte: require('../../assets/texturas/gota-3.png'), proporcao: 60 / 48 },
  { fonte: require('../../assets/texturas/gota-6.png'), proporcao: 61 / 56 },
];
// Proporção altura/largura das demais texturas.
const PROPORCAO = {
  pincel: 211 / 440,
  faixa: 293 / 420,
  respingos: [333 / 380, 415 / 380, 234 / 240, 275 / 260],
};

// Respingos grandes do fundo, como na proposta aprovada. Três arranjos, um por tela,
// para não repetir. Cada item: [respingo, esquerda, topo, largura, giro, opacidade].
const FUNDOS = [
  [
    [1, -70, -60, 190, 0, 0.55],
    [0, 292, 410, 150, 20, 0.4],
    [3, -46, 600, 120, 0, 0.3],
  ],
  [
    [0, -60, -50, 170, -15, 0.5],
    [1, 296, 330, 150, 30, 0.35],
    [3, -40, 640, 110, 10, 0.3],
  ],
  [
    [3, 300, -40, 150, 0, 0.45],
    [1, -70, 380, 150, -20, 0.35],
    [0, 300, 640, 120, 0, 0.3],
  ],
];

export function Tela({ children, rolagem = true, fundo = 0 }) {
  const Conteudo = rolagem ? ScrollView : View;
  const propsConteudo = rolagem
    ? { contentContainerStyle: estilos.conteudo, keyboardShouldPersistTaps: 'handled' }
    : { style: [estilos.conteudo, { flex: 1 }] };

  return (
    <SafeAreaView style={estilos.tela} edges={['top']}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Image source={TEXTURAS.ruas} style={StyleSheet.absoluteFill} resizeMode="cover" />
        {FUNDOS[fundo % FUNDOS.length].map(([r, left, top, largura, giro, opacity], i) => (
          <Image
            key={i}
            source={TEXTURAS.respingos[r]}
            style={{
              position: 'absolute',
              left,
              top,
              width: largura,
              height: largura * PROPORCAO.respingos[r],
              opacity,
              transform: [{ rotate: `${giro}deg` }],
            }}
          />
        ))}
      </View>
      <Conteudo {...propsConteudo}>{children}</Conteudo>
    </SafeAreaView>
  );
}

// Respingo de spray avulso (decoração). `tipo` de 0 a 3; a altura segue a proporção.
export function Respingo({ tipo = 2, largura = 80, estilo }) {
  return (
    <Image
      source={TEXTURAS.respingos[tipo]}
      pointerEvents="none"
      style={[
        { position: 'absolute', width: largura, height: largura * PROPORCAO.respingos[tipo] },
        estilo,
      ]}
    />
  );
}

// Bloco de spray "rasgado" na cor pedida, com sombra sólida deslocada (estilo grafite).
// Usado nos itens selecionados (filtros, tipos, dia de hoje). O conteúdo fica por cima.
export function BlocoSpray({ cor = cores.laranja, corSombra = '#000000', distancia = 4 }) {
  return (
    <>
      <Image
        source={TEXTURAS.bloco}
        resizeMode="stretch"
        style={[
          estilos.blocoCamada,
          {
            top: distancia,
            left: distancia,
            right: -distancia,
            bottom: -distancia,
            tintColor: corSombra,
          },
        ]}
      />
      <Image
        source={TEXTURAS.bloco}
        resizeMode="stretch"
        style={[estilos.blocoCamada, { tintColor: cor }]}
      />
    </>
  );
}

// Título de grafite: letras brancas com contorno preto, pincelada de spray laranja
// embaixo e escorridos de tinta saindo das letras, como na proposta aprovada.
// `gotas`: posição de cada escorrido, em fração da largura do texto (0 = início, 1 = fim).
// `sublinhado`: [início, largura] da pincelada, também em fração da largura do texto.
// `tamanho` é o tamanho máximo. Com `ajustar`, o título só diminui (nunca aumenta)
// para caber em até `linhas` linhas na largura disponível.
export function TituloGrafite({
  children,
  tamanho = 46,
  linhas,
  ajustar = false,
  escalaMinima = 0.6,
  centralizar = false,
  gotas = [0.05, 0.5, 0.95],
  sublinhado = [0.4, 0.66],
  estilo,
}) {
  const [largura, setLargura] = useState(0);
  const propsTexto = {
    numberOfLines: linhas,
    adjustsFontSizeToFit: ajustar,
    minimumFontScale: ajustar ? escalaMinima : undefined,
  };
  const estiloTexto = [estilos.tituloGrafite, { fontSize: tamanho, lineHeight: tamanho * 1.3 }];
  const larguraPincel = sublinhado[1] * largura;

  return (
    <View style={[{ marginBottom: 6 }, estilo]}>
      {/* A altura de linha maior que a fonte evita que o iOS corte o topo das letras. */}
      <View
        onLayout={(e) => setLargura(e.nativeEvent.layout.width)}
        style={[estilos.tituloBloco, { alignSelf: centralizar ? 'center' : 'flex-start' }]}
      >
        {largura > 0 && (
          <Image
            source={TEXTURAS.pincel}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: sublinhado[0] * largura,
              top: tamanho * 0.86,
              width: larguraPincel,
              height: larguraPincel * PROPORCAO.pincel,
              transform: [{ rotate: '-1deg' }],
            }}
          />
        )}
        {/* Contorno: uma cópia preta levemente deslocada atrás do texto. */}
        <Text
          {...propsTexto}
          style={[estiloTexto, estilos.tituloContorno]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {children}
        </Text>
        <Text {...propsTexto} style={estiloTexto}>
          {children}
        </Text>
        {largura > 0 &&
          gotas.map((fracao, i) => {
            const gota = GOTAS[i % GOTAS.length];
            const w = Math.round(tamanho * (i % 2 ? 0.3 : 0.22));
            return (
              <Image
                key={i}
                source={gota.fonte}
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: fracao * largura - w / 2,
                  top: tamanho * 0.88,
                  width: w,
                  height: w * gota.proporcao,
                }}
              />
            );
          })}
      </View>
    </View>
  );
}

// Rótulo pequeno em letra de bloco (ex.: "TREINO · HOJE 19H").
export function Rotulo({ children, cor = cores.laranja, estilo }) {
  return <Text style={[estilos.rotulo, { color: cor }, estilo]}>{children}</Text>;
}

// Botão estilo adesivo. Variantes: laranja (ação), verde (confirmar presença), contorno
// e spray (preto com contorno e texto laranja, seta e borrifo de spray atrás).
export function BotaoAdesivo({
  titulo,
  aoTocar,
  variante = 'laranja',
  inclinacao = 0,
  desativado = false,
  largo = false,
  rotuloAcessivel,
}) {
  if (variante === 'spray') {
    return (
      <View style={{ alignSelf: largo ? 'stretch' : 'flex-start' }}>
        <Image
          source={TEXTURAS.faixa}
          pointerEvents="none"
          style={[estilos.faixaBotao, { height: 230 * PROPORCAO.faixa }]}
        />
        <Pressable
          onPress={aoTocar}
          disabled={desativado}
          accessibilityRole="button"
          accessibilityLabel={rotuloAcessivel || titulo}
          accessibilityState={{ disabled: desativado }}
          style={({ pressed }) => [
            estilos.botao,
            estilos.botaoSpray,
            {
              transform: [{ rotate: `${inclinacao}deg` }, { scale: pressed ? 0.97 : 1 }],
              opacity: desativado ? 0.45 : 1,
            },
            sombraAdesivo('#000000', 4),
          ]}
        >
          <Text style={[estilos.botaoTexto, estilos.botaoSprayTexto]}>{titulo}</Text>
          <Ionicons name="chevron-forward" size={20} color={cores.laranja} />
        </Pressable>
      </View>
    );
  }

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
// Selecionada: bloco de spray rasgado na cor da categoria, com sombra grafite preta.
// Não selecionada: fundo preto, contorno branco e sombra preta.
// `alta`: versão maior, usada nas abas Perto de mim / Cena Brasil.
// `compacta`: menos respiro lateral, para várias etiquetas dividirem uma linha (Mapa);
// o texto diminui um pouco se precisar, em vez de quebrar.
export function Etiqueta({
  titulo,
  ativa,
  aoTocar,
  inclinacao = 0,
  corAtiva = cores.laranja,
  corTextoAtiva = cores.fundo,
  alta = false,
  compacta = false,
}) {
  return (
    <Pressable
      onPress={aoTocar}
      accessibilityRole="button"
      accessibilityState={{ selected: !!ativa }}
      style={[
        estilos.etiqueta,
        alta && estilos.etiquetaAlta,
        compacta && estilos.etiquetaCompacta,
        ativa ? estilos.etiquetaAtiva : [estilos.etiquetaInativa, sombraAdesivo('#000000', 3)],
        { transform: [{ rotate: `${inclinacao}deg` }] },
      ]}
    >
      {ativa ? <BlocoSpray cor={corAtiva} /> : null}
      <Text
        numberOfLines={compacta ? 1 : undefined}
        adjustsFontSizeToFit={compacta}
        minimumFontScale={compacta ? 0.8 : undefined}
        style={[
          estilos.etiquetaTexto,
          alta && { fontSize: 17 },
          { color: ativa ? corTextoAtiva : cores.texto },
        ]}
      >
        {titulo}
      </Text>
    </Pressable>
  );
}

// Cartão de papel colado com fita (estilo lambe-lambe).
// Textura de linhas leves, respingo laranja no canto e dois escorridos na borda de baixo.
export function CartaoPapel({ children, inclinacao = -1 }) {
  return (
    <View style={[estilos.papel, { transform: [{ rotate: `${inclinacao}deg` }] }]}>
      <Image
        source={TEXTURAS.papelLinhas}
        resizeMode="repeat"
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      />
      <Image
        source={TEXTURAS.respingos[2]}
        pointerEvents="none"
        style={[estilos.papelRespingo, { height: 104 * PROPORCAO.respingos[2] }]}
      />
      <View pointerEvents="none" style={estilos.papelGotas}>
        <Image source={GOTAS[5].fonte} style={{ width: 18, height: 18 * GOTAS[5].proporcao }} />
        <Image
          source={GOTAS[1].fonte}
          style={{ width: 12, height: 12 * GOTAS[1].proporcao, marginLeft: 2 }}
        />
      </View>
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
        <View style={{ marginTop: 18 }}>
          <BotaoAdesivo titulo={acao} aoTocar={aoTocarAcao} inclinacao={-2} variante="spray" />
        </View>
      ) : null}
    </CartaoPapel>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#0B0B0C',
  },
  conteudo: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 18,
  },
  tituloBloco: {
    maxWidth: '100%',
    transform: [{ rotate: '-3deg' }],
  },
  tituloGrafite: {
    fontFamily: fontes.titulo,
    color: cores.texto,
    textShadowColor: '#000000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  // Mesma largura do texto principal (left/right), para o ajuste de tamanho ser igual.
  tituloContorno: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: 1,
    color: '#000000',
    textShadowOffset: { width: 0, height: 0 },
  },
  blocoCamada: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: undefined,
    height: undefined,
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
  botaoSpray: {
    flexDirection: 'row',
    gap: 10,
    minHeight: 50,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: cores.laranja,
    backgroundColor: '#0B0B0C',
  },
  botaoSprayTexto: {
    fontSize: 19,
    color: cores.laranja,
  },
  faixaBotao: {
    position: 'absolute',
    left: -16,
    top: -14,
    width: 230,
    opacity: 0.85,
  },
  etiqueta: {
    minHeight: 42,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  etiquetaAlta: {
    minHeight: 50,
  },
  etiquetaCompacta: {
    paddingHorizontal: 6,
  },
  etiquetaAtiva: {
    backgroundColor: 'transparent',
  },
  etiquetaInativa: {
    backgroundColor: '#0B0B0C',
    borderWidth: 2,
    borderColor: cores.texto,
  },
  etiquetaTexto: {
    fontFamily: fontes.bloco,
    fontSize: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  papel: {
    backgroundColor: '#EDEBE6',
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 0,
  },
  papelRespingo: {
    position: 'absolute',
    left: -30,
    top: -26,
    width: 104,
    opacity: 0.95,
  },
  papelGotas: {
    position: 'absolute',
    right: 22,
    bottom: -34,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  fita: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -39,
    width: 78,
    height: 20,
    backgroundColor: 'rgba(200,200,190,0.85)',
    transform: [{ rotate: '3deg' }],
  },
  vazioTitulo: {
    fontFamily: fontes.bloco,
    fontSize: 23,
    lineHeight: 27,
    color: cores.textoPapel,
    textTransform: 'uppercase',
  },
  vazioTexto: {
    fontFamily: fontes.texto,
    fontSize: 15,
    lineHeight: 21,
    color: '#2B2B2B',
    marginTop: 8,
  },
});
