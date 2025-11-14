import { AuthProvider } from '@/contexto/autenticacion';
import { UbicacionesProvider } from '@/contexto/ubicaciones';
import { Slot } from "expo-router";
import { View } from "react-native";
import { ZonasProvider } from '@/contexto/zonas';

export default function layout() {
  return (
    <AuthProvider>
      <ZonasProvider>
        <UbicacionesProvider>
          <View style={{ flex: 1 }}>
            <Slot />
          </View>
        </UbicacionesProvider>
      </ZonasProvider>
    </AuthProvider>
  );
}