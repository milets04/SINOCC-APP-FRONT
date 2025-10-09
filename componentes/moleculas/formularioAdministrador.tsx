import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Boton from '../atomos/boton';
import Input from '../atomos/input';

export interface FormularioAdministradorData {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  fotoUri: string | null;
}

interface FormularioAdministradorProps {
  onSubmit: (data: FormularioAdministradorData) => void;
  titulo?: string;
}

const FormularioAdministrador: React.FC<FormularioAdministradorProps> = ({
  onSubmit,
  titulo = 'Crear nuevo administrador',
}) => {
  const [formData, setFormData] = useState<FormularioAdministradorData>({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    fotoUri: null,
  });

  const pickImage = async () => {
    // Solicitar permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Necesitamos permisos para acceder a la galería');
      return;
    }

    // Abrir selector de imágenes
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFormData({ ...formData, fotoUri: uri });
    }
  };

  const handleSubmit = () => {
    // Validación básica
    if (!formData.nombre || !formData.apellido || !formData.correo || !formData.contrasena) {
      alert('Por favor complete todos los campos');
      return;
    }

    if (!formData.fotoUri) {
      alert('Por favor seleccione una foto');
      return;
    }

    onSubmit(formData);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Título */}
      <Text style={styles.titulo}>{titulo}</Text>

      {/* Nombre */}
      <Input
        width={310}
        height={47}
        placeholder="Nombre"
        value={formData.nombre}
        onChangeText={(text) => setFormData({ ...formData, nombre: text })}
      />

      {/* Apellido */}
      <Input
        width={310}
        height={47}
        placeholder="Apellido"
        value={formData.apellido}
        onChangeText={(text) => setFormData({ ...formData, apellido: text })}
      />

      {/* Correo */}
      <Input
        width={310}
        height={47}
        placeholder="Correo"
        value={formData.correo}
        onChangeText={(text) => setFormData({ ...formData, correo: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Contraseña */}
      <Input
        width={310}
        height={47}
        placeholder="Contraseña"
        value={formData.contrasena}
        onChangeText={(text) => setFormData({ ...formData, contrasena: text })}
        secureTextEntry
      />

      {/* Área de Foto */}
      <View style={styles.fotoContainer}>
        {formData.fotoUri ? (
          <Image source={{ uri: formData.fotoUri }} style={styles.fotoPreview} />
        ) : (
          <Text style={styles.fotoPlaceholder}>Foto</Text>
        )}
        
        <TouchableOpacity 
          style={styles.botonSubirFoto}
          onPress={pickImage}
          activeOpacity={0.7}
        >
          <Text style={styles.botonSubirFotoTexto}>Subir Foto</Text>
        </TouchableOpacity>
      </View>

      {/* Botón Registrar */}
      <View style={styles.botonContainer}>
        <Boton
          texto="Registrar"
          onPress={handleSubmit}
          variante="primario"
          estilo={styles.botonRegistrar}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    alignSelf: 'center',
    marginBottom: 8,
    textAlign: 'center',
  },
  fotoContainer: {
    width: 310,
    height: 169,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fotoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  fotoPlaceholder: {
    fontSize: 16,
    color: '#999999',
    position: 'absolute',
    top: 60,
  },
  botonSubirFoto: {
    position: 'absolute',
    bottom: 20,
    width: 92,
    height: 34,
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonSubirFotoTexto: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
  },
  botonContainer: {
    width: 310,
    alignItems: 'center',
    marginTop: 16,
  },
  botonRegistrar: {
    width: 289,
    height: 50,
  },
});

export default FormularioAdministrador;