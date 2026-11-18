import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { EstadoVazio, Etiqueta, Tela, TituloGrafite } from '../../src/components/Rua';
import { cores, fontes, sombraAdesivo } from '../../src/theme';
import { COR_NAO_LIDA, useNotificacoes } from '../../src/notificacoes';

const logo = require('../../assets/logo.png');

export default function Inicio() {
  const router = useRouter();
  const [aba, setAba] = useState('perto');
  const { naoLidas } = useNotificacoes();

  return (
    <Tela>
      {/* Topo: logo oficial centralizada e sininho à direita */}
      <View style={estilos.topo}>
        <View style={estilos.lateral} />
        <Image
          source={logo}
          style={estilos.logo}
          resizeMode="contain"
          accessibilityLabel="B-Maps"
        />
        <Pressable
          onPress={() => router.push('/notificacoes')}
          accessibilityRole="button"
          accessibilityLabel={naoLidas > 0 ? `Notificações, ${naoLidas} não lidas` : 'Notificações'}
          style={[estilos.sino, sombraAdesivo(cores.laranja)]}
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={naoLidas > 0 ? COR_NAO_LIDA : cores.texto}
          />
        </Pressable>
      </View>

      <View>
        <TituloGrafite>O que tá rolando</TituloGrafite>
        <Text style={estilos.regiao}>Sua região: ainda não definida</Text>
      </View>

      <View style={estilos.abas} accessibilityRole="tablist">
        <Etiqueta
          titulo="Perto de mim"
          ativa={aba === 'perto'}
          aoTocar={() => setAba('perto')}
          inclinacao={-2}
        />
        <Etiqueta
          titulo="Cena Brasil"
          ativa={aba === 'brasil'}
          aoTocar={() => setAba('brasil')}
          inclinacao={1.5}
        />
      </View>

      {aba === 'perto' ? (
        <EstadoVazio
          titulo="Ainda não tem nada por aqui"
          texto="Quando alguém publicar um evento, treino, pico ou aula perto de você, aparece aqui."
          acao="Avisar a cena"
          aoTocarAcao={() => router.push('/publicar')}
        />
      ) : (
        <EstadoVazio
          titulo="A Cena Brasil ainda está vazia"
          texto="Aqui vão aparecer os eventos de todos os estados."
          acao="Avisar a cena"
          aoTocarAcao={() => router.push('/publicar')}
        />
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 112,
  },
  lateral: {
    width: 46,
  },
  logo: {
    height: 104,
    width: 172,
    transform: [{ rotate: '-2deg' }],
  },
  sino: {
    width: 46,
    height: 46,
    borderWidth: 2,
    borderColor: cores.texto,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '3deg' }],
  },
  regiao: {
    fontFamily: fontes.marcador,
    fontSize: 15,
    color: cores.textoSuave,
    marginTop: 4,
  },
  abas: {
    flexDirection: 'row',
    gap: 12,
  },
});
