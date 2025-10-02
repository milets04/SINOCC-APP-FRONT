import React, { useState } from 'react';
import {
  Image,
  View,
  StyleSheet,
  Alert,
  Platform,
  Text,
  TouchableOpacity, // Importamos TouchableOpacity para el botón personalizado
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons'; // Opcional: Iconos de Expo para mejorar el diseño

interface SubirFotoProps {
  onImageSelected: (uri: string) => void;
}

const SubirFoto: React.FC<SubirFotoProps> = ({ onImageSelected }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    // Lógica de permisos (se mantiene igual)
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso Requerido',
          'Necesitamos el permiso de acceso a la galería para que esto funcione.'
        );
        return;
      }
    }

    // Lógica de selección de imagen (se mantiene igual)
    const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      const uri = selectedAsset.uri;

      setImageUri(uri);
      onImageSelected(uri);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Reemplazamos el <Button> nativo por el TouchableOpacity.
        Esto nos permite aplicar estilos CSS al contenedor del botón.
      */}
      <TouchableOpacity style={styles.customButton} onPress={pickImage}>
        <MaterialIcons name="add-a-photo" size={24} color="#fff" />
        <Text style={styles.buttonText}>
          {imageUri ? 'Cambiar Foto' : 'Subir Foto'}
        </Text>
      </TouchableOpacity>

      {/* Vista previa de la imagen seleccionada */}
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <Text style={styles.fileName}>
            Foto: {imageUri.substring(imageUri.lastIndexOf('/') + 1)}
          </Text>
        </View>
      )}
    </View>
  );
};

// --- Estilos Actualizados ---
const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    width: '100%',
  },
  // Estilos del nuevo botón personalizado (TouchableOpacity)
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#146BF6', // Color de marca azul
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
  },
  // Contenedor de la vista previa de la imagen
  imageContainer: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#146BF6',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  image: {
    width: 200,
    height: 400,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  fileName: {
    fontSize: 14,
    marginTop: 8,
    paddingHorizontal: 10,
    color: '#333',
    fontStyle: 'italic',
  },
});

export default SubirFoto;