import { UbicacionesProvider } from '@/contexto/ubicaciones';
import { Slot } from "expo-router";
import { View } from "react-native";

export default function layout() {
  return (
    <UbicacionesProvider>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </UbicacionesProvider>
  );
}