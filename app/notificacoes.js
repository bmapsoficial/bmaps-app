import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { EstadoVazio, Tela, TituloGrafite } from '../src/components/Rua';
import { cores, fontes, sombraAdesivo } from '../src/theme';
import { useNotificacoes } from '../src/notificacoes';

export default function Notificacoes() {
  const router = useRouter();
  const { lista } = useNotificacoes();

  const voltar = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <Tela>
      <View style={estilos.topo}>
        <Pressable
          onPress={voltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar ao Início"
          style={[estilos.voltar, sombraAdesivo(cores.laranja)]}
        >
          <Ionicons name="chevron-back" size={22} color={cores.texto} />
        </Pressable>
      </View>

      <TituloGrafite tamanho={42}>Notificações</TituloGrafite>

      {lista.length === 0 ? (
        <EstadoVazio
          titulo="Nenhuma notificação por enquanto"
          texto="Eventos novos na sua região, lembretes do “Eu vou” e avisos dos picos vão aparecer aqui."
        />
      ) : (
        <View style={{ gap: 12 }}>
          {lista.map((n) => (
            <View
              key={n.id}
              style={[estilos.item, !n.lida && { borderColor: cores.laranja }]}
              accessible
              accessibilityLabel={`${n.lida ? '' : 'Não lida. '}${n.titulo}. ${n.texto || ''}`}
            >
              <Text style={estilos.itemTitulo}>{n.titulo}</Text>
              {n.texto ? <Text style={estilos.itemTexto}>{n.texto}</Text> : null}
              {n.quando ? <Text style={estilos.itemQuando}>{n.quando}</Text> : null}
            </View>
          ))}
        </View>
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    marginTop: 4,
  },
  voltar: {
    width: 46,
    height: 46,
    borderWidth: 2,
    borderColor: cores.texto,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    borderWidth: 2,
    borderColor: cores.borda,
    backgroundColor: cores.cartao,
    padding: 14,
    gap: 4,
  },
  itemTitulo: {
    fontFamily: fontes.bloco,
    fontSize: 16,
    letterSpacing: 1,
    color: cores.texto,
    textTransform: 'uppercase',
  },
  itemTexto: {
    fontFamily: fontes.texto,
    fontSize: 14,
    lineHeight: 20,
    color: cores.textoSuave,
  },
  itemQuando: {
    fontFamily: fontes.marcador,
    fontSize: 13,
    color: cores.laranjaClaro,
  },
});
