import SettingsItem from "@/componentes/moleculas/menuConf";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
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
      
      <SettingsItem
        icon="bell"
        iconLibrary="feather"
        iconColor="#146BF6"
        title="Activar notificaciones"
        description="Recibe notificaciones sobre nuevos cierres"
        switchValue={notificationsEnabled}
        onSwitchChange={setNotificationsEnabled}
      />
      
      <SettingsItem
        icon="location"
        iconLibrary="evil"
        iconColor="#146BF6"
        title="Alertas por ubicación"
        description="Alertas de cierres cerca de ti"
        switchValue={locationEnabled}
        onSwitchChange={setLocationEnabled}
      />
    </View>
  );
}
