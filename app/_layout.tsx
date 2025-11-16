import { AuthProvider } from '@/contexto/autenticacion';
import { CierresProvider } from '@/contexto/cierres';
import { UbicacionesProvider } from '@/contexto/ubicaciones';
import { ZonasProvider } from '@/contexto/zonas';
import { Slot } from "expo-router";
import { View } from "react-native";

export default function layout() {
  return (
    <AuthProvider>
      <ZonasProvider>
        <UbicacionesProvider>
          <CierresProvider>
            <View style={{ flex: 1 }}>
              <Slot />
            </View>
          </CierresProvider>
        </UbicacionesProvider>
      </ZonasProvider>
    </AuthProvider>
  );
}