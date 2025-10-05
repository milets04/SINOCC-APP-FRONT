import MenuInf from '@/componentes/moleculas/menuInf';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from "react-native";

const handleGoHome = () => {
    console.log('Navegando a Home');
  };

  const handleGoMap = () => {
    console.log('Navegando a Mapa');
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
      }}>Sistema de Notificación de Cierre de Calles</Text>

      <MenuInf
        homeIcon={<Ionicons name="home-outline" size={32} color="#146BF6" />}
        mapIcon={<Ionicons name="map-outline" size={32} color="#146BF6" />}
        onHomePress={handleGoHome}
        onMapPress={handleGoMap}
      />
    </View>
  );
}
