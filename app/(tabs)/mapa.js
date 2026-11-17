import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Etiqueta, Tela, TituloGrafite } from '../../src/components/Rua';
import { cores, fontes, sombraAdesivo } from '../../src/theme';

const FILTROS = ['Tudo', 'Eventos', 'Treinos', 'Picos', 'Aulas'];
const INCLINACOES = [-2, 1, -1, 1.5, -1];

export default function Mapa() {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Tudo');

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
        {FILTROS.map((nome, i) => (
          <Etiqueta
            key={nome}
            titulo={nome}
            ativa={filtro === nome}
            aoTocar={() => setFiltro(nome)}
            inclinacao={INCLINACOES[i]}
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
        <View style={estilos.legendaItem}>
          <View style={[estilos.marca, { backgroundColor: cores.laranja }]} />
          <Text style={estilos.legendaTexto}>Evento</Text>
        </View>
        <View style={estilos.legendaItem}>
          <View style={[estilos.marca, { backgroundColor: cores.texto }]} />
          <Text style={estilos.legendaTexto}>Treino</Text>
        </View>
        <View style={estilos.legendaItem}>
          <View
            style={[
              estilos.marca,
              { borderWidth: 2, borderStyle: 'dashed', borderColor: cores.verdeClaro },
            ]}
          />
          <Text style={estilos.legendaTexto}>Pico</Text>
        </View>
        <View style={estilos.legendaItem}>
          <View style={[estilos.marca, { borderWidth: 2, borderColor: cores.cinza }]} />
          <Text style={estilos.legendaTexto}>Aula</Text>
        </View>
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
  marca: {
    width: 12,
    height: 12,
  },
  legendaTexto: {
    fontFamily: fontes.bloco,
    fontSize: 13,
    letterSpacing: 1,
    color: cores.textoSuave,
    textTransform: 'uppercase',
  },
});
