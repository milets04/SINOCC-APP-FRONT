import Boton from '@/componentes/atomos/boton';
import Input from '@/componentes/atomos/input';
import SubirFoto from '@/componentes/atomos/subirFoto';
import TituloPestania from '@/componentes/atomos/tituloPestania';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import HeaderSimple from '../moleculas/headerSimple';

const SINOCC_PM = require('../../assets/images/SINOCC_PM.png');

export default function CrearAdmin() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleImageSelected = (uri: string) => {
    setFotoUri(uri);
  };

  const handleRegistrar = async () => {
    if (!nombre.trim() || !apellido.trim() || !correo.trim() || !contrasena.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (!fotoUri) {
      alert('Por favor sube una foto');
      return;
    }

    setCargando(true);

    try {
      //lógica de registro
      console.log('Registrando admin:', {
        nombre,
        apellido,
        correo,
        contrasena,
        foto: fotoUri,
      });

      setTimeout(() => {
        alert('Administrador creado exitosamente');

        setNombre('');
        setApellido('');
        setCorreo('');
        setContrasena('');
        setFotoUri(null);
        setCargando(false);
      }, 1500);
    } catch (error) {
      alert('Error al crear el administrador');
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>

      <HeaderSimple onPressRoute="/gestionAdmins"/>

      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.titleContainer}>
          <TituloPestania>Crear nuevo administrador</TituloPestania>
        </View>

        <View style={styles.formContainer}>
          <Input
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            editable={!cargando}
          />

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
            placeholder="Contraseña"
            value={contrasena}
            onChangeText={setContrasena}
            editable={!cargando}
            secureTextEntry
            style={{ marginTop: 16 }}
          />

          <View style={styles.fotoContainer}>
            <SubirFoto onImageSelected={handleImageSelected} />
          </View>

          <View style={styles.buttonContainer}>
            <Boton
              texto="Registrar"
              onPress={handleRegistrar}
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
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 25,
  },
  logo: {
    width: 130,
    height: 50,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 30,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  formContainer: {
    paddingHorizontal: 16,
    gap: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 8,
    paddingVertical: 20,
  },
  fotoContainer: {
    marginTop: 16,
    width: '100%',
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderBlockColor: '2px solid #1a1616ff',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 10,
  },
});