import { Text, View } from "react-native";
import Boton from "../componentes/atomos/boton";
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
      }}>Sistema de Notif</Text>

      <Boton
        texto="Presióname"
        onPress={() =>
          Alert.alert("¡Funciona!", "El botón se presionó correctamente.")
        }
        variante="primario"
        tamaño="mediano"
        ancho="ajustado"
      />

    </View>
  );
}
