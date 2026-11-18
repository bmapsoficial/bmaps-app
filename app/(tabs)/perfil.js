import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { CartaoPapel, Etiqueta, Rotulo, Tela, TituloGrafite } from '../../src/components/Rua';
import { cores, fontes, sombraAdesivo } from '../../src/theme';

const PAPEIS = [
  'B-boy',
  'B-girl',
  'Crew',
  'Organizador(a)',
  'Professor(a)',
  'DJ',
  'MC',
  'Jurado(a)',
  'Curto a cultura',
];
const INCLINACOES = [-2, 1.5, -1, 1, -1.5, 2, -1, 1, -2];

export default function Perfil() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [papeis, setPapeis] = useState([]);

  const alternarPapel = (papel) =>
    setPapeis((atual) =>
      atual.includes(papel) ? atual.filter((p) => p !== papel) : [...atual, papel],
    );

  const iniciais =
    nome
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('') || '?';

  return (
    <Tela>
      <View style={estilos.topo}>
        <Pressable
          onPress={() => router.push('/configuracoes')}
          accessibilityRole="button"
          accessibilityLabel="Configurações"
          style={[estilos.botaoConfiguracoes, sombraAdesivo(cores.laranja)]}
        >
          <Ionicons name="settings-outline" size={20} color={cores.texto} />
        </Pressable>
      </View>

      <View style={estilos.cabecalho}>
        <View style={[estilos.avatar, sombraAdesivo(cores.texto, 4)]}>
          <Text style={estilos.avatarTexto}>{iniciais}</Text>
        </View>
        <View style={{ flex: 1, gap: 8 }}>
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome artístico"
            placeholderTextColor={cores.cinza}
            accessibilityLabel="Nome artístico"
            style={estilos.nome}
          />
          <TextInput
            value={cidade}
            onChangeText={setCidade}
            placeholder="Cidade · crew"
            placeholderTextColor={cores.cinza}
            accessibilityLabel="Cidade e crew"
            style={estilos.cidade}
          />
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <Rotulo cor={cores.textoSuave}>Seus papéis na cena</Rotulo>
        <View style={estilos.papeis}>
          {PAPEIS.map((papel, i) => (
            <Etiqueta
              key={papel}
              titulo={papel}
              ativa={papeis.includes(papel)}
              aoTocar={() => alternarPapel(papel)}
              inclinacao={INCLINACOES[i]}
            />
          ))}
        </View>
      </View>

      <View style={estilos.numeros}>
        {[
          ['—', 'Eventos publicados', cores.laranja],
          ['—', 'Confirmados pela cena', cores.verdeClaro],
          ['—', 'Check-ins em picos', cores.laranja],
        ].map(([valor, legenda, cor], i) => (
          <View
            key={legenda}
            style={[estilos.numero, { transform: [{ rotate: `${[-1.5, 1, -0.5][i]}deg` }] }]}
          >
            <Text style={[estilos.numeroValor, { color: cor }]}>{valor}</Text>
            <Text style={estilos.numeroLegenda}>{legenda}</Text>
          </View>
        ))}
      </View>

      <CartaoPapel>
        <Text style={estilos.papelTitulo}>Eu vou</Text>
        <Text style={estilos.papelTexto}>Você ainda não marcou presença em nada.</Text>
      </CartaoPapel>

      <View style={estilos.notificacoes}>
        <Text style={estilos.notificacoesTitulo}>Minhas notificações</Text>
        <Text style={estilos.notificacoesTexto}>
          A escolha de regiões e tipos de aviso entra numa próxima etapa.
        </Text>
      </View>

      <Text style={estilos.nota}>
        Versão de teste: o que você preencher no perfil ainda não é salvo.
      </Text>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  avatar: {
    width: 84,
    height: 84,
    backgroundColor: cores.laranja,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-4deg' }],
  },
  avatarTexto: {
    fontFamily: fontes.grafite,
    fontSize: 40,
    color: cores.fundo,
  },
  nome: {
    fontFamily: fontes.grafite,
    fontSize: 28,
    color: cores.texto,
    paddingVertical: 2,
  },
  cidade: {
    fontFamily: fontes.marcador,
    fontSize: 15,
    color: cores.textoSuave,
    paddingVertical: 2,
  },
  papeis: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  numeros: {
    flexDirection: 'row',
    gap: 10,
  },
  numero: {
    flex: 1,
    borderWidth: 2,
    borderColor: cores.texto,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  numeroValor: {
    fontFamily: fontes.grafite,
    fontSize: 30,
    lineHeight: 34,
  },
  numeroLegenda: {
    fontFamily: fontes.bloco,
    fontSize: 11,
    letterSpacing: 1,
    color: cores.textoSuave,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 4,
  },
  papelTitulo: {
    fontFamily: fontes.bloco,
    fontSize: 20,
    color: cores.textoPapel,
    textTransform: 'uppercase',
  },
  papelTexto: {
    fontFamily: fontes.texto,
    fontSize: 15,
    color: '#333333',
    marginTop: 6,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  // Mesmo desenho do sininho da tela Início.
  botaoConfiguracoes: {
    width: 46,
    height: 46,
    borderWidth: 2,
    borderColor: cores.texto,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '3deg' }],
  },
  notificacoes: {
    borderWidth: 2,
    borderColor: cores.laranja,
    padding: 14,
    gap: 4,
  },
  notificacoesTitulo: {
    fontFamily: fontes.bloco,
    fontSize: 16,
    letterSpacing: 1,
    color: cores.texto,
    textTransform: 'uppercase',
  },
  notificacoesTexto: {
    fontFamily: fontes.texto,
    fontSize: 13,
    lineHeight: 18,
    color: cores.textoSuave,
  },
  nota: {
    fontFamily: fontes.texto,
    fontSize: 13,
    lineHeight: 18,
    color: cores.textoSuave,
  },
});
