import { Tabs } from 'expo-router';

import BarraNavegacao from '../../src/components/BarraNavegacao';
import { cores } from '../../src/theme';

export default function LayoutAbas() {
  return (
    <Tabs
      tabBar={(props) => <BarraNavegacao {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="mapa" />
      <Tabs.Screen name="publicar" />
      <Tabs.Screen name="agenda" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}
