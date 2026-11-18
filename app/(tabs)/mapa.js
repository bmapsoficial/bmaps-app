import { useCallback, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

import { CartaoPapel, Etiqueta, Tela, TituloGrafite } from '../../src/components/Rua';
import { cores, coresCategoria, fontes, sombraAdesivo } from '../../src/theme';
import { alternarFiltro } from '../../src/filtroMapa';

// Cada filtro, quando selecionado, usa a cor da própria categoria.
// Não há filtro "Todos": nenhum filtro ativo já mostra todas as categorias.
const FILTROS = [
  { chave: 'evento', nome: 'Eventos', cor: coresCategoria.evento },
  { chave: 'treino', nome: 'Treinos', cor: coresCategoria.treino },
  { chave: 'pico', nome: 'Picos', cor: coresCategoria.pico },
  { chave: 'aula', nome: 'Aulas', cor: coresCategoria.aula },
];
const INCLINACOES = [1, -1, 1.5, -1];

// Legenda: os mesmos arquivos SVG dos marcadores do mapa.
const LEGENDA = [
  { nome: 'Evento', marcador: require('../../assets/marcadores/evento.svg') },
  { nome: 'Treino', marcador: require('../../assets/marcadores/treino.svg') },
  { nome: 'Pico', marcador: require('../../assets/marcadores/pico.svg') },
  { nome: 'Aula', marcador: require('../../assets/marcadores/aula.svg') },
];

export default function Mapa() {
  const [busca, setBusca] = useState('');
  // null = nenhum filtro (mostra tudo). Ao entrar na aba, volta a mostrar tudo.
  const [filtro, setFiltro] = useState(null);
  useFocusEffect(
    useCallback(() => {
      setFiltro(null);
    }, []),
  );

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

      {/* Os quatro filtros dividem a mesma linha. Tocar de novo no ativo remove o filtro. */}
      <View style={estilos.filtros}>
        {FILTROS.map(({ chave, nome, cor }, i) => (
          <View key={chave} style={estilos.filtro}>
            <Etiqueta
              titulo={nome}
              ativa={filtro === chave}
              aoTocar={() => setFiltro((atual) => alternarFiltro(atual, chave))}
              inclinacao={INCLINACOES[i]}
              corAtiva={cor}
              compacta
            />
          </View>
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
    gap: 8,
  },
  filtro: {
    flex: 1,
    minWidth: 0,
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
