import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { Anton_400Regular } from '@expo-google-fonts/anton';
import { PermanentMarker_400Regular } from '@expo-google-fonts/permanent-marker';
import { SedgwickAveDisplay_400Regular } from '@expo-google-fonts/sedgwick-ave-display';

import { cores } from '../src/theme';
import { ProvedorSessao, useSessao } from '../src/auth/Sessao';

export default function LayoutRaiz() {
  const [fontesProntas] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Anton_400Regular,
    PermanentMarker_400Regular,
    SedgwickAveDisplay_400Regular,
    // Fonte dos títulos: cópia da Barcelona Graffiti Bombing com os acentos do
    // português acrescentados (o arquivo original vinha sem eles).
    BarcelonaGraffiti: require('../assets/fonts/BarcelonaGraffiti-BMaps.ttf'),
  });

  // Enquanto as fontes carregam, mostra só o fundo escuro (evita piscar com a fonte errada).
  if (!fontesProntas) {
    return <View style={{ flex: 1, backgroundColor: cores.fundo }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <ProvedorSessao>
        <Navegacao />
      </ProvedorSessao>
    </SafeAreaProvider>
  );
}

// EXPERIMENTO (branch experimento/firebase-auth): o app inteiro exige conta com e-mail
// confirmado. Sem sessão, só as telas de acesso; com sessão sem e-mail confirmado, só a
// tela de confirmação. O Stack.Protected do Expo Router redireciona sozinho.
function Navegacao() {
  const { carregando, usuario, emailConfirmado } = useSessao();

  // Enquanto o Firebase lê a sessão guardada no Keychain, mostra só o fundo escuro.
  if (carregando) {
    return <View style={{ flex: 1, backgroundColor: cores.fundo }} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Protected guard={!usuario}>
        <Stack.Screen name="entrar" />
        <Stack.Screen name="cadastrar" />
        <Stack.Screen name="recuperar-senha" />
      </Stack.Protected>
      <Stack.Protected guard={!!usuario && !emailConfirmado}>
        <Stack.Screen name="confirmar-email" />
      </Stack.Protected>
      <Stack.Protected guard={!!usuario && emailConfirmado}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="configuracoes" />
        <Stack.Screen name="notificacoes" />
        <Stack.Screen name="sessao-teste" />
      </Stack.Protected>
    </Stack>
  );
}
