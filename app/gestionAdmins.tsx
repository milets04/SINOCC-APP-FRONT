import TemplateGestionAdministradores from "@/componentes/templates/templateGestionAdmin";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

type Administrador = {
  id: string;
  nombre: string;
  correo: string;
  usuario: string;
  fotoUri: string;
};

export default function GestionAdmins() {
  const router = useRouter();

  // Estado con administradores de ejemplo
  const [administradores] = useState<Administrador[]>([
    {
      id: '1',
      nombre: 'Juan Pérez',
      correo: 'juan.perez@example.com',
      usuario: 'jperez',
      fotoUri: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      nombre: 'María García',
      correo: 'maria.garcia@example.com',
      usuario: 'mgarcia',
      fotoUri: 'https://via.placeholder.com/150',
    },
  ]);

  const handleEditAdmin = (nombre: string) => {
    Alert.alert('Editar', `Editar administrador: ${nombre}`);
  };

  const handleDeleteAdmin = (nombre: string) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar a ${nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive' },
      ]
    );
  };

  const handleRegistrarNuevo = () => {
    router.push('/crearAdmin');
  };

  return (
    <TemplateGestionAdministradores
      administradores={administradores.map((a) => ({ ...a, fotoUri: { uri: a.fotoUri } }))}
      onEditAdmin={handleEditAdmin}
      onDeleteAdmin={handleDeleteAdmin}
      onRegistrarNuevo={handleRegistrarNuevo}
      homeIcon={<Ionicons name="home-outline" size={28} color="#146BF6" />}
      usersIcon={<Ionicons name="people-outline" size={28} color="#146BF6" />}
    />
  );
}