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

export default function LayoutRaiz() {
  const [fontesProntas] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Anton_400Regular,
    PermanentMarker_400Regular,
    SedgwickAveDisplay_400Regular,
  });

  // Enquanto as fontes carregam, mostra só o fundo escuro (evita piscar com a fonte errada).
  if (!fontesProntas) {
    return <View style={{ flex: 1, backgroundColor: cores.fundo }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: cores.fundo },
        }}
      />
    </SafeAreaProvider>
  );
}
