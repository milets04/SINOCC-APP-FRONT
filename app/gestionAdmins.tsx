import TemplateGestionAdministradores from "@/componentes/templates/templateGestionAdmin";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import conexion from "./conexion";

type Administrador = {
  id: string;
  nombre: string;
  correo: string;
  usuario: string;
  fotoUri?: string | null;
};

export default function GestionAdmins() {
  const router = useRouter();
  const [administradores, setAdministradores] = useState<Administrador[]>([]);
  const [cargando, setCargando] = useState(false);

  // Estado con administradores de ejemplo
  /*const [administradores] = useState<Administrador[]>([
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
  ]);*/

  const cargarAdministradores = async () => {
    setCargando(true);
    try {
      const lista = await conexion.obtenerAdministradores();

      const adminsFormateados = lista.map((admin: any) => ({
        id: String(admin.id),
        nombre: `${admin.nombre} ${admin.apellido}`,
        correo: admin.correo,
        usuario: admin.correo.split("@")[0], // puedes cambiar esto según tus datos
        fotoUri: admin.foto || "https://via.placeholder.com/150",
      }));

      setAdministradores(adminsFormateados);
    } catch (error) {
      console.error("❌ Error al cargar administradores:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAdministradores();
  }, []);

  const handleEditAdmin = (nombre: string) => {
  const admin = administradores.find((a) => a.nombre === nombre);
  if (admin) {
    router.push({
      pathname: "/editarAdmins",
      params: {
        id: admin.id,
        nombre: admin.nombre,
        correo: admin.correo,
        usuario: admin.usuario,
      },
    });
  }
};

  const handleDeleteAdmin = (nombre: string) => {
    const admin = administradores.find((a) => a.nombre === nombre);
    if (!admin) return;

    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de eliminar a ${nombre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const respuesta = await conexion.eliminarAdministrador(admin.id);
            if (respuesta.exito) {
              Alert.alert("Éxito", respuesta.mensaje);
              await cargarAdministradores(); // recargar lista
            } else {
              Alert.alert("Error", respuesta.mensaje);
            }
          },
        },
      ]
    );
  };

  const handleRegistrarNuevo = () => {
    router.push("/crearAdmin");
  };

  return (
    <TemplateGestionAdministradores
      administradores={administradores.map((a) => ({
        nombre: a.nombre,
        correo: a.correo,
        usuario: a.usuario,
        fotoUri: a.fotoUri
        ?{ uri: a.fotoUri } 
        :{uri: "https://via.placeholder.com/150"} , }))} 
      onEditAdmin={handleEditAdmin}
      onDeleteAdmin={handleDeleteAdmin}
      onRegistrarNuevo={handleRegistrarNuevo}
      homeIcon={<Ionicons name="home-outline" size={28} color="#146BF6" />}
      usersIcon={<Ionicons name="people-outline" size={28} color="#146BF6" />}
    />
  );
}