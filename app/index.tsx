import { Text, View } from "react-native";
import MenuIcon from '@/componentes/atomos/menu';
import { Ionicons } from '@expo/vector-icons';

const handleMapPress = () => {
    console.log('Mapa presionado');
    // Tu lógica aquí
  };
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{
        color: "blue",
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center"
      }}>Sistema de Notificacion de Cierre de Calles - SINOCC</Text>

      <MenuIcon
        icon={<Ionicons name="map-outline" size={32} color="#146BF6" />}
        onPress={handleMapPress}
      />
    </View>
  );
}
