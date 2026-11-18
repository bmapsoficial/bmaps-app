import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

import { Tela, TituloGrafite } from '../src/components/Rua';
import { cores, fontes, sombraAdesivo } from '../src/theme';

// Seções previstas. Nesta etapa nenhuma delas tem função: são só a estrutura,
// sem toque, sem seta e com o selo EM BREVE. Cada uma vira um botão de verdade
// quando a sua função for implementada.
const SECOES = [
  {
    titulo: 'Notificações',
    icone: 'notifications-outline',
    descricao: 'Regiões, tipos de aviso e resumo diário.',
  },
  {
    titulo: 'Privacidade',
    icone: 'lock-closed-outline',
    descricao: '“Vou colar” sem mostrar o nome e os seus dados (LGPD).',
  },
  {
    titulo: 'Conta',
    icone: 'person-circle-outline',
    descricao: 'E-mail, senha, sair e excluir conta.',
  },
  {
    titulo: 'Localização',
    icone: 'location-outline',
    descricao: 'Permissão de localização e cidade padrão.',
  },
  {
    titulo: 'Aparência',
    icone: 'color-palette-outline',
    descricao: 'Ajustes visuais do app.',
  },
  {
    titulo: 'Ajuda e suporte',
    icone: 'help-circle-outline',
    descricao: 'Dúvidas, contato com a equipe e termos de uso.',
  },
];

export default function Configuracoes() {
  const router = useRouter();
  const versao = Constants.expoConfig?.version;

  const voltar = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/perfil');
    }
  };

  return (
    <Tela>
      <View style={estilos.topo}>
        <Pressable
          onPress={voltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar ao Perfil"
          style={[estilos.voltar, sombraAdesivo(cores.laranja)]}
        >
          <Ionicons name="chevron-back" size={22} color={cores.texto} />
        </Pressable>
      </View>

      <TituloGrafite tamanho={42}>Configurações</TituloGrafite>

      <View style={{ gap: 12 }}>
        {SECOES.map((secao) => (
          <View
            key={secao.titulo}
            accessible
            accessibilityLabel={`${secao.titulo}. ${secao.descricao} Em breve.`}
            style={estilos.secao}
          >
            <View style={estilos.icone}>
              <Ionicons name={secao.icone} size={22} color={cores.fundo} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={estilos.secaoTitulo}>{secao.titulo}</Text>
              <Text style={estilos.secaoTexto}>{secao.descricao}</Text>
            </View>
            <Text style={estilos.selo}>Em breve</Text>
          </View>
        ))}
      </View>

      {versao ? <Text style={estilos.versao}>B-Maps {versao} · versão de teste</Text> : null}
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
  secao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: cores.borda,
    backgroundColor: cores.cartao,
    padding: 14,
  },
  icone: {
    width: 40,
    height: 40,
    backgroundColor: cores.laranja,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-4deg' }],
  },
  secaoTitulo: {
    fontFamily: fontes.bloco,
    fontSize: 17,
    letterSpacing: 1,
    color: cores.texto,
    textTransform: 'uppercase',
  },
  secaoTexto: {
    fontFamily: fontes.texto,
    fontSize: 13,
    lineHeight: 18,
    color: cores.textoSuave,
  },
  selo: {
    fontFamily: fontes.bloco,
    fontSize: 11,
    letterSpacing: 1,
    color: cores.textoSuave,
    textTransform: 'uppercase',
    borderWidth: 2,
    borderColor: cores.cinza,
    paddingHorizontal: 6,
    paddingVertical: 2,
    transform: [{ rotate: '6deg' }],
  },
  versao: {
    fontFamily: fontes.texto,
    fontSize: 13,
    color: cores.textoSuave,
    textAlign: 'center',
    marginTop: 8,
  },
});
