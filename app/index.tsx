import CierreAct from "@/componentes/moleculas/cierreAct";
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
      <CierreAct
       titulo="Pine Street"
          lugar="Shopping Center"
          descripcion="Minor utility work — single lane closure"
          horaInicio="1:15 PM"
          estimado="1-2 hours"
          categoriaAlerta="peligro"
          categoriaNivel="ALTO"
          style={{ marginHorizontal: 6 }}
          onPress={() => {}}/>
    </View> 
  );
}
