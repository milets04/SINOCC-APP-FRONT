import Subtitulo from '@/componentes/atomos/subtitulo';
import Switch from '@/componentes/atomos/switch';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface Zone {
  id: string;
  name: string;
  enabled: boolean;
}

interface ZoneNotificationsProps {
  title?: string;
  zones: Zone[];
  onZoneToggle: (zoneId: string, newValue: boolean) => void;
  containerStyle?: ViewStyle;
}

const ZoneNotifications: React.FC<ZoneNotificationsProps> = ({
  title = "Notificaciones por áreas",
  zones,
  onZoneToggle,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.mainTitle}>{title}</Text>
      
      <View style={styles.zonesContainer}>
        {zones.map((zone) => (
          <View key={zone.id} style={styles.zoneItem}>
            <Subtitulo style={styles.zoneName}>{zone.name}</Subtitulo>
            
            <Switch
              value={zone.enabled}
              onValueChange={(newValue) => onZoneToggle(zone.id, newValue)}
              trackColorActive="#000000"
              trackColorInactive="#000000"
              thumbColor="#FFFFFF"
              width={60}
              height={34}
              circleSize={26}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 18,
    width: '87%',
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Almarai',
    marginBottom: 20,
  },
  zonesContainer: {
    gap: 16,
  },
  zoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});

export default ZoneNotifications;