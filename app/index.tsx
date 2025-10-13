import ZoneNotifications from '@/componentes/moleculas/menuZonas';
import { useState } from 'react';
import { Text, View } from "react-native";
export default function Index() {
  const [zones, setZones] = useState([
    { id: '1', name: 'Sacaba', enabled: false },
    { id: '2', name: 'Quillacollo', enabled: false },
    { id: '3', name: 'Zona centro', enabled: false },
  ]);

  const handleZoneToggle = (zoneId: string, newValue: boolean) => {
    setZones(prevZones =>
      prevZones.map(zone =>
        zone.id === zoneId ? { ...zone, enabled: newValue } : zone
      )
    );
    console.log(`Zona ${zoneId} cambió a: ${newValue}`);
  };
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
      <ZoneNotifications
        zones={zones}
        onZoneToggle={handleZoneToggle}
      />
    </View>
  );
}