import { Text, View } from "react-native";
import Titulo from '@/componentes/atomos/tituloNotificacion';

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
      <Titulo>Hola este es un titulo</Titulo>
    </View>
    
    
  );
}
