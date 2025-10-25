import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PantallaPruebaConexion() {
  const [respuesta, setRespuesta] = useState<string>('Aún no probado');

  const probarConexion = async () => {
    try {
      const res = await fetch('http://192.168.100.9:3000/api/estado');
      const datos = await res.json();
      setRespuesta(JSON.stringify(datos, null, 2));
    } catch (error: any) {
      setRespuesta('❌ Error: ' + error.message);
      console.log('Error de conexión:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Probar conexión con backend" onPress={probarConexion} />
      <ScrollView style={styles.resultado}>
        <Text style={styles.texto}>{respuesta}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  resultado: { marginTop: 20, maxHeight: 300, width: '100%' },
  texto: { fontSize: 14, textAlign: 'center' },
});