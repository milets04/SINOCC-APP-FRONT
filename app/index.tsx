import BotonHeader from "@/componentes/atomos/botonHeader";
import { Text, View } from "react-native";

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
      <BotonHeader icon="bell" onPress={() => console.log("click campana")} />
    </View>
  );
}
