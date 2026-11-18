// Janela "Qual publicação fazer?" da tela Avisar a cena.
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { cores, coresCategoria, fontes } from '../theme';

const CATEGORIAS = [
  {
    nome: 'Evento',
    chamada: 'Faça acontecer!',
    cor: coresCategoria.evento,
    texto:
      'Divulgue batalhas, campeonatos, festivais e encontros especiais. Compartilhe datas e horários e convide a cena.',
  },
  {
    nome: 'Treino',
    chamada: 'Treine junto, evolua junto!',
    cor: coresCategoria.treino,
    texto:
      'Divulgue sessões abertas, livres ou guiadas e convide outras pessoas para treinar e trocar experiências.',
  },
  {
    nome: 'Pico',
    chamada: 'A cena se encontra aqui!',
    cor: coresCategoria.pico,
    texto:
      'Compartilhe lugares de encontro e informe os dias e horários habituais em que a galera costuma colar.',
  },
  {
    nome: 'Aula',
    chamada: 'Compartilhe conhecimento!',
    cor: coresCategoria.aula,
    texto:
      'Divulgue aulas, oficinas, cursos e turmas para encontrar novos alunos e fortalecer a cultura.',
  },
];

export default function InfoPublicacao({ visivel, aoFechar }) {
  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={aoFechar}>
      <View style={estilos.fundo}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={aoFechar}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
        />
        <View style={estilos.janela}>
          <View style={estilos.cabecalho}>
            <Text style={estilos.titulo} accessibilityRole="header">
              Qual publicação fazer?
            </Text>
            <Pressable
              onPress={aoFechar}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              hitSlop={10}
              style={estilos.fechar}
            >
              <Ionicons name="close" size={20} color={cores.texto} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={estilos.conteudo} showsVerticalScrollIndicator={false}>
            <Text style={estilos.intro}>
              Escolha a categoria que melhor representa o que você quer compartilhar com a cena.
            </Text>

            {CATEGORIAS.map((c) => (
              <View key={c.nome} style={estilos.item}>
                <Text style={estilos.itemTitulo}>
                  <Text style={{ color: c.cor }}>{c.nome}</Text>
                  <Text style={estilos.itemChamada}> — {c.chamada}</Text>
                </Text>
                <Text style={estilos.itemTexto}>{c.texto}</Text>
              </View>
            ))}

            <Text style={estilos.final}>A cena é feita por todos nós!</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: 18,
  },
  janela: {
    maxHeight: '86%',
    backgroundColor: cores.fundo,
    borderWidth: 2,
    borderColor: cores.texto,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titulo: {
    flex: 1,
    fontFamily: fontes.bloco,
    fontSize: 22,
    letterSpacing: 1,
    color: cores.laranja,
    textTransform: 'uppercase',
  },
  fechar: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: cores.texto,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conteudo: {
    paddingHorizontal: 18,
    paddingBottom: 20,
    gap: 16,
  },
  intro: {
    fontFamily: fontes.texto,
    fontSize: 14,
    lineHeight: 20,
    color: cores.textoSuave,
  },
  item: {
    gap: 4,
  },
  itemTitulo: {
    fontFamily: fontes.bloco,
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  itemChamada: {
    color: cores.texto,
  },
  itemTexto: {
    fontFamily: fontes.texto,
    fontSize: 14,
    lineHeight: 20,
    color: cores.textoSuave,
  },
  final: {
    fontFamily: fontes.textoNegrito,
    fontSize: 15,
    color: cores.texto,
    textAlign: 'center',
    marginTop: 4,
  },
});
