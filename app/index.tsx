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
      }}>Sistema de Notificación de Cierre de Calles</Text>
    </View>
  );
}
