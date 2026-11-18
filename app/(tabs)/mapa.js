import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { Etiqueta, Tela, TituloGrafite } from '../../src/components/Rua';
import { cores, fontes, sombraAdesivo } from '../../src/theme';

// Cada filtro, quando selecionado, usa a cor da própria categoria.
const FILTROS = [
  { nome: 'Todos', cor: '#858585' },
  { nome: 'Eventos', cor: '#F28C28' },
  { nome: 'Treinos', cor: '#35C5E8' },
  { nome: 'Picos', cor: '#299D58' },
  { nome: 'Aulas', cor: '#A78BFA' },
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
    <Tela>
      <TituloGrafite tamanho={44}>Mapa</TituloGrafite>

      <View style={[estilos.busca, sombraAdesivo(cores.laranja)]}>
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
      <View style={estilos.areaMapa}>
        <Ionicons name="map-outline" size={40} color={cores.laranja} />
        <Text style={estilos.avisoTitulo}>O mapa entra na próxima etapa</Text>
        <Text style={estilos.avisoTexto}>
          Aqui vão aparecer os eventos, treinos, picos e aulas perto de você, com a sua localização.
        </Text>
      </View>

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
    gap: 8,
  },
  areaMapa: {
    minHeight: 280,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: cores.laranja,
    backgroundColor: cores.cartao,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  avisoTitulo: {
    fontFamily: fontes.bloco,
    fontSize: 20,
    color: cores.texto,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  avisoTexto: {
    fontFamily: fontes.texto,
    fontSize: 14,
    lineHeight: 20,
    color: cores.textoSuave,
    textAlign: 'center',
  },
  legenda: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
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
