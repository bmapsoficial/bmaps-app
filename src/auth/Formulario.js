// EXPERIMENTO (branch experimento/firebase-auth). Peças visuais das telas de acesso.
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Rotulo } from '../components/Rua';
import { cores, fontes, sombraAdesivo } from '../theme';

export function Campo({ rotulo, ...props }) {
  return (
    <View style={{ gap: 6 }}>
      <Rotulo cor={cores.textoSuave}>{rotulo}</Rotulo>
      <TextInput placeholderTextColor={cores.cinza} style={estilos.campo} {...props} />
    </View>
  );
}

export function Aviso({ children, tipo = 'info' }) {
  if (!children) return null;
  return (
    <Text
      style={[estilos.aviso, tipo === 'erro' && { color: '#FF8A80' }]}
      accessibilityLiveRegion="polite"
    >
      {children}
    </Text>
  );
}

const estilos = StyleSheet.create({
  campo: {
    minHeight: 48,
    borderWidth: 2,
    borderColor: cores.texto,
    backgroundColor: cores.fundo,
    color: cores.texto,
    paddingHorizontal: 12,
    fontFamily: fontes.marcador,
    fontSize: 16,
    ...sombraAdesivo('#000000', 3),
  },
  aviso: {
    fontFamily: fontes.texto,
    fontSize: 14,
    lineHeight: 20,
    color: cores.textoSuave,
  },
});
