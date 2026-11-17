import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BotaoAdesivo, Etiqueta, Rotulo, Tela, TituloGrafite } from '../../src/components/Rua';
import { cores, fontes } from '../../src/theme';

// Campos de cada tipo, seguindo o documento de conceito.
const TIPOS = {
  Evento: [
    { chave: 'nome', rotulo: 'Nome do evento', dica: 'Ex.: nome da batalha ou jam' },
    { chave: 'quando', rotulo: 'Data e hora', dica: 'Ex.: sáb 22/11 · 14h' },
    { chave: 'local', rotulo: 'Local', dica: 'Endereço ou nome do lugar' },
    { chave: 'formato', rotulo: 'Formato', dica: 'Ex.: 1x1, 2x2, crew vs crew' },
    { chave: 'entrada', rotulo: 'Entrada', dica: 'Gratuita ou valor' },
  ],
  Treino: [
    { chave: 'local', rotulo: 'Local', dica: 'Endereço ou nome do lugar' },
    { chave: 'quando', rotulo: 'Dia e horário', dica: 'Ex.: toda terça e quinta · 19h' },
    { chave: 'nivel', rotulo: 'Pra quem é', dica: 'Ex.: iniciantes, todos os níveis' },
    { chave: 'como', rotulo: 'Como vai ser', dica: 'Ex.: bate-papo, workshop, treino livre' },
  ],
  Pico: [
    { chave: 'nome', rotulo: 'Nome do pico', dica: 'Como a galera chama o lugar' },
    { chave: 'local', rotulo: 'Local', dica: 'Endereço ou ponto de referência' },
    { chave: 'piso', rotulo: 'Tipo de piso', dica: 'Ex.: concreto liso, linóleo' },
  ],
  Aula: [
    { chave: 'local', rotulo: 'Local', dica: 'Endereço ou nome do lugar' },
    { chave: 'professor', rotulo: 'Professor(a)', dica: 'Nome artístico' },
    { chave: 'quando', rotulo: 'Dia e horário', dica: 'Ex.: sábado · 10h' },
    { chave: 'nivel', rotulo: 'Nível', dica: 'Ex.: iniciante' },
  ],
};
const NOMES_TIPOS = Object.keys(TIPOS);
const INCLINACOES = [-3, 1, -1, 2];

export default function Publicar() {
  const [tipo, setTipo] = useState('Evento');
  const [valores, setValores] = useState({});

  const atualizar = (chave, texto) => setValores((v) => ({ ...v, [chave]: texto }));

  const avisoVersaoTeste = () =>
    Alert.alert(
      'Versão de teste',
      'Nesta etapa nada é publicado ainda. O envio de verdade entra quando o servidor do B-Maps for ligado.',
    );

  return (
    <Tela>
      <TituloGrafite tamanho={42}>Avisar a cena</TituloGrafite>

      <View style={{ gap: 10 }}>
        <Rotulo cor={cores.textoSuave}>O que vai rolar?</Rotulo>
        <View style={estilos.tipos}>
          {NOMES_TIPOS.map((nome, i) => (
            <View key={nome} style={{ flex: 1 }}>
              <Etiqueta
                titulo={nome}
                ativa={tipo === nome}
                aoTocar={() => setTipo(nome)}
                inclinacao={INCLINACOES[i]}
              />
            </View>
          ))}
        </View>
      </View>

      <Pressable
        onPress={() =>
          Alert.alert('Em breve', 'A leitura automática do flyer entra numa próxima etapa.')
        }
        accessibilityRole="button"
        accessibilityLabel="Subir o flyer (em breve)"
        style={estilos.flyer}
      >
        <View style={estilos.flyerIcone}>
          <Ionicons name="image-outline" size={24} color={cores.fundo} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={estilos.flyerTitulo}>Subir o flyer</Text>
          <Text style={estilos.flyerTexto}>em breve: o app lê e preenche pra você</Text>
        </View>
      </Pressable>

      <View style={{ gap: 12 }}>
        {TIPOS[tipo].map((campo) => (
          <View key={`${tipo}-${campo.chave}`} style={{ gap: 6 }}>
            <Rotulo cor={cores.textoSuave}>{campo.rotulo}</Rotulo>
            <TextInput
              value={valores[`${tipo}-${campo.chave}`] || ''}
              onChangeText={(t) => atualizar(`${tipo}-${campo.chave}`, t)}
              placeholder={campo.dica}
              placeholderTextColor={cores.cinza}
              accessibilityLabel={campo.rotulo}
              style={estilos.campo}
            />
          </View>
        ))}
      </View>

      <BotaoAdesivo
        titulo="Publicar e avisar a região"
        aoTocar={avisoVersaoTeste}
        inclinacao={-1}
        largo
      />
      <Text style={estilos.nota}>
        Versão de teste: o que você preencher aqui ainda não é enviado nem salvo.
      </Text>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  tipos: {
    flexDirection: 'row',
    gap: 8,
  },
  flyer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: cores.laranja,
  },
  flyerIcone: {
    width: 46,
    height: 46,
    backgroundColor: cores.laranja,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-5deg' }],
  },
  flyerTitulo: {
    fontFamily: fontes.bloco,
    fontSize: 19,
    letterSpacing: 1,
    color: cores.texto,
    textTransform: 'uppercase',
  },
  flyerTexto: {
    fontFamily: fontes.marcador,
    fontSize: 14,
    color: cores.laranjaClaro,
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
  },
  nota: {
    fontFamily: fontes.texto,
    fontSize: 13,
    lineHeight: 18,
    color: cores.textoSuave,
  },
});
