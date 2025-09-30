import MarcadorMapa from "@/componentes/atomos/marcadorMapa";
import { useState } from 'react';
import { Text, View } from "react-native";

  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggle = (newValue: boolean) => {
    setIsEnabled(newValue);
    // Aquí puedes agregar tu lógica personalizada
    console.log('Switch cambiado a:', newValue);
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
      }}>Sistema de0 Notificacion de Cierre de Calles - SINOCC</Text>
      <MarcadorMapa/>
    </View>
  );
}
