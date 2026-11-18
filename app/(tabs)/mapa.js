import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { CartaoPapel, Etiqueta, Tela, TituloGrafite } from '../../src/components/Rua';
import { cores, coresCategoria, fontes, sombraAdesivo } from '../../src/theme';

// Cada filtro, quando selecionado, usa a cor da própria categoria.
const FILTROS = [
  { nome: 'Todos', cor: coresCategoria.todas },
  { nome: 'Eventos', cor: coresCategoria.evento },
  { nome: 'Treinos', cor: coresCategoria.treino },
  { nome: 'Picos', cor: coresCategoria.pico },
  { nome: 'Aulas', cor: coresCategoria.aula },
];
const INCLINACOES = [-2, 1, -1, 1.5, -1];

// Legenda: os mesmos arquivos SVG dos marcadores do mapa.
const LEGENDA = [
  { nome: 'Evento', marcador: require('../../assets/marcadores/evento.svg') },
  { nome: 'Treino', marcador: require('../../assets/marcadores/treino.svg') },
  { nome: 'Pico', marcador: require('../../assets/marcadores/pico.svg') },
  { nome: 'Aula', marcador: require('../../assets/marcadores/aula.svg') },
];

export default function Mapa() {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');

  return (
    <Tela fundo={1}>
      {/* Sempre em uma linha: começa em 44 e só diminui se a largura da tela não comportar. */}
      <TituloGrafite tamanho={40} linhas={1} ajustar gotas={[0.024, 0.319, 0.703, 0.979]}>
        Onde acontece a cena
      </TituloGrafite>

      <View style={[estilos.busca, sombraAdesivo(cores.laranja, 4)]}>
        <Ionicons name="search" size={20} color={cores.laranja} />
        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="Cidade, bairro ou lugar"
          placeholderTextColor={cores.cinza}
          style={estilos.campoBusca}
          accessibilityLabel="Buscar cidade, bairro ou lugar"
          returnKeyType="search"
        />
      </View>

      <View style={estilos.filtros}>
        {FILTROS.map(({ nome, cor }, i) => (
          <Etiqueta
            key={nome}
            titulo={nome}
            ativa={filtro === nome}
            aoTocar={() => setFiltro(nome)}
            inclinacao={INCLINACOES[i]}
            corAtiva={cor}
          />
        ))}
      </View>

      {/* Espaço reservado: o mapa real entra numa próxima etapa. */}
      <CartaoPapel inclinacao={-0.6}>
        <View style={estilos.areaMapa}>
          <Image
            source={LEGENDA[0].marcador}
            style={estilos.marcaGrande}
            contentFit="contain"
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
          <Text style={estilos.avisoTitulo}>O mapa entra na próxima etapa</Text>
          <Text style={estilos.avisoTexto}>
            Aqui vão aparecer os eventos, treinos, picos e aulas perto de você, com a sua
            localização.
          </Text>
        </View>
      </CartaoPapel>

      <View style={estilos.legenda}>
        {LEGENDA.map(({ nome, marcador }) => (
          <View key={nome} style={estilos.legendaItem}>
            <Image
              source={marcador}
              style={estilos.marca}
              contentFit="contain"
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
            <Text style={estilos.legendaTexto}>{nome}</Text>
          </View>
        ))}
      </View>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: cores.texto,
    backgroundColor: cores.fundo,
  },
  campoBusca: {
    flex: 1,
    color: cores.texto,
    fontFamily: fontes.marcador,
    fontSize: 16,
    paddingVertical: 10,
  },
  filtros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  // Espaço reservado do mapa, dentro de um cartão de papel (proposta visual aprovada).
  areaMapa: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 18,
    paddingBottom: 8,
  },
  marcaGrande: {
    width: 36,
    height: 48,
  },
  avisoTitulo: {
    fontFamily: fontes.bloco,
    fontSize: 21,
    lineHeight: 26,
    color: cores.textoPapel,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  avisoTexto: {
    fontFamily: fontes.texto,
    fontSize: 14,
    lineHeight: 20,
    color: '#2B2B2B',
    textAlign: 'center',
  },
  legenda: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // Mesma proporção dos marcadores (48 × 64).
  marca: {
    width: 18,
    height: 24,
  },
  legendaTexto: {
    fontFamily: fontes.bloco,
    fontSize: 13,
    letterSpacing: 1,
    color: cores.textoSuave,
    textTransform: 'uppercase',
  },
});
