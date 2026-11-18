import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { cores, fontes, sombraAdesivo } from '../theme';

const ITENS = {
  index: { rotulo: 'Início', icone: 'home-outline', iconeAtivo: 'home' },
  mapa: { rotulo: 'Mapa', icone: 'map-outline', iconeAtivo: 'map' },
  publicar: { rotulo: 'Publicar' },
  agenda: { rotulo: 'Agenda', icone: 'calendar-outline', iconeAtivo: 'calendar' },
  perfil: { rotulo: 'Perfil', icone: 'person-outline', iconeAtivo: 'person' },
};

// Menu inferior no estilo rua: borda laranja, rótulos em letra de bloco
// e o botão central de publicar como um adesivo inclinado.
//
// A partir do Expo Router 58 (SDK 58), a barra personalizada recebe
// { state, descriptors, emitter, navigateToTab, insets } e não recebe mais
// o objeto `navigation`. O toque segue o mesmo fluxo da barra padrão:
// emite o evento tabPress pelo `emitter` e troca de aba com `navigateToTab`.
export default function BarraNavegacao({ state, emitter, navigateToTab }) {
  const margens = useSafeAreaInsets();

  return (
    <View style={[estilos.barra, { paddingBottom: Math.max(margens.bottom, 10) }]}>
      {state.routes.map((rota, indice) => {
        const item = ITENS[rota.name];
        if (!item) return null;
        const ativo = state.index === indice;

        const aoTocar = () => {
          const evento = emitter.emit({
            type: 'tabPress',
            target: rota.key,
            canPreventDefault: true,
          });
          if (!ativo && !evento?.defaultPrevented) {
            navigateToTab(rota.key);
          }
        };

        if (rota.name === 'publicar') {
          return (
            <Pressable
              key={rota.key}
              onPress={aoTocar}
              accessibilityRole="button"
              accessibilityLabel="Publicar"
              style={estilos.item}
            >
              <View style={[estilos.botaoMais, sombraAdesivo(cores.texto)]}>
                <Ionicons name="add" size={32} color={cores.fundo} />
              </View>
            </Pressable>
          );
        }

        const cor = ativo ? cores.laranja : cores.textoSuave;
        return (
          <Pressable
            key={rota.key}
            onPress={aoTocar}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            accessibilityLabel={item.rotulo}
            style={estilos.item}
          >
            <Ionicons name={ativo ? item.iconeAtivo : item.icone} size={23} color={cor} />
            <Text style={[estilos.rotulo, { color: cor }]}>{item.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    backgroundColor: cores.fundoBarra,
    borderTopWidth: 3,
    borderTopColor: cores.laranja,
    paddingTop: 10,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minHeight: 48,
  },
  rotulo: {
    fontFamily: fontes.bloco,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  botaoMais: {
    width: 56,
    height: 56,
    backgroundColor: cores.laranja,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-6deg' }],
    marginTop: -14,
  },
});
