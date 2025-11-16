import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

interface Zone {
  id: string;
  name: string;
  enabled: boolean;
}

interface ZoneNotificationsProps {
  zones: Zone[];
  onZoneToggle: (id: string, enabled: boolean) => void;
  disabled?: boolean;
}

export default function ZoneNotifications({ 
  zones, 
  onZoneToggle,
  disabled = false 
}: ZoneNotificationsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Notificaciones por Área</Text>
      {zones.map((zone) => (
        <View key={zone.id} style={[
          styles.zoneItem,
          disabled && styles.zoneItemDisabled
        ]}>
          <Text style={[
            styles.zoneName,
            disabled && styles.zoneNameDisabled
          ]}>
            {zone.name}
          </Text>
          <Switch
            value={zone.enabled}
            onValueChange={(value) => onZoneToggle(zone.id, value)}
            disabled={disabled}
            trackColor={{ 
              false: disabled ? '#D1D5DB' : '#E5E7EB', 
              true: disabled ? '#93C5FD' : '#146BF6' 
            }}
            thumbColor={disabled ? '#9CA3AF' : '#FFFFFF'}
            style={disabled && styles.switchDisabled}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  zoneItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  zoneItemDisabled: {
    opacity: 0.5,
  },
  zoneName: {
    fontSize: 15,
    color: '#050505ff',
  },
  zoneNameDisabled: {
    color: '#9CA3AF',
  },
  switchDisabled: {
    opacity: 0.5,
  },
});