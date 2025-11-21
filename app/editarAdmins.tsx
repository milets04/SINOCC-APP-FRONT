import Boton from '@/componentes/atomos/boton';
import Input from '@/componentes/atomos/input';
import TituloPestania from '@/componentes/atomos/tituloPestania';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import conexion from './conexion';

const SINOCC_PM = require('../assets/images/SINOCC_PM.png');

export default function EditarAdmin() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  // 🔹 Cargar datos del admin desde la base de datos al entrar
  useEffect(() => {
    const cargarDatos = async () => {
      if (!id) return;
      setCargando(true);
      try {
        const admin = await conexion.obtenerAdministradorPorId(id);
        if (admin) {
          setNombre(admin.nombre || '');
          setApellido(admin.apellido || '');
          setCorreo(admin.correo || '');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los datos del administrador.');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  // 🔹 Guardar cambios en la base de datos
  const handleGuardarCambios = async () => {
    if (!nombre.trim() || !apellido.trim() || !correo.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }

    setCargando(true);
    try {
      const respuesta = await conexion.editarAdministrador(id, {
        nombre,
        apellido,
        correo,
        contrasena: contrasena.trim() || undefined, // si no cambia contraseña, no la manda
      });

      if (respuesta.exito) {
        Alert.alert('Éxito', 'Datos actualizados correctamente.', [
          { text: 'OK', onPress: () => router.back() }, // vuelve a la lista
        ]);
      } else {
        Alert.alert('Error', respuesta.mensaje || 'No se pudieron actualizar los datos.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al guardar los cambios.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={SINOCC_PM} style={styles.logo} resizeMode="contain" />
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.titleContainer}>
          <TituloPestania>Editar datos del administrador</TituloPestania>
        </View>

        <View style={styles.formContainer}>
          <Input placeholder="Nombre" value={nombre} onChangeText={setNombre} editable={!cargando} />
          <Input
            placeholder="Apellido"
            value={apellido}
            onChangeText={setApellido}
            editable={!cargando}
            style={{ marginTop: 16 }}
          />
          <Input
            placeholder="Correo"
            value={correo}
            onChangeText={setCorreo}
            editable={!cargando}
            keyboardType="email-address"
            style={{ marginTop: 16 }}
          />
          <Input
            placeholder="Nueva contraseña (opcional)"
            value={contrasena}
            onChangeText={setContrasena}
            editable={!cargando}
            secureTextEntry
            style={{ marginTop: 16 }}
          />

          <View style={styles.buttonContainer}>
            <Boton
              texto="Guardar cambios"
              onPress={handleGuardarCambios}
              variante="primario"
              ancho="completo"
              tamaño="mediano"
              deshabilitado={cargando}
              cargando={cargando}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#146BF6',
  },
  logo: { width: 130, height: 50 },
  scrollContent: { flex: 1 },
  scrollContentContainer: { paddingBottom: 30 },
  titleContainer: { paddingHorizontal: 16, paddingVertical: 16, alignItems: 'center' },
  formContainer: {
    paddingHorizontal: 16,
    gap: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 8,
    paddingVertical: 20,
  },
  buttonContainer: { marginTop: 24, marginBottom: 10 },
});