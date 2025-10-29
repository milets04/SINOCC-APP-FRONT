import Boton from "@/componentes/atomos/boton";
import TituloPestania from "@/componentes/atomos/tituloPestania";
import CardCierre from "@/componentes/moleculas/cardCierre";
import HeaderSimple from "@/componentes/moleculas/headerSimple";
import MenuInf from "@/componentes/moleculas/menuInf";
import ModalConfirmacion from "@/componentes/moleculas/modalConfirmacion";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

interface Cierre {
  id: string | number;
  titulo: string;
  subtitulo: string[];
}

const PrincSuper = () => {
  const router = useRouter();

  // Estado para manejar la lista de cierres
  const [cierres, setCierres] = useState<Cierre[]>([
    {
      id: 1,
      titulo: "Cierre en Av. América",
      subtitulo: ["Zona", "Duración: 2 días", "Motivo: Amago de tuberías"],
    },
  ]);

  // Estados para el modal de confirmación
  const [modalVisible, setModalVisible] = useState(false);
  const [cierreAEliminar, setCierreAEliminar] = useState<Cierre | null>(null);

  const navegarACrearCierre = () => {
    router.push("/crearCierre");
  };

  const navegarAEditarCierre = () => {
    router.push("/editarCierre");
  };

  // Función para mostrar el modal de confirmación
  const handleMostrarModalEliminar = (cierre: Cierre) => {
    setCierreAEliminar(cierre);
    setModalVisible(true);
  };

  // Función para confirmar y eliminar el cierre
  const handleConfirmarEliminar = () => {
    if (cierreAEliminar) {
      // Eliminar el cierre del estado
      setCierres(cierres.filter((c) => c.id !== cierreAEliminar.id));
      
      console.log('Cierre eliminado:', cierreAEliminar.titulo);
      
      // Aquí puedes agregar la lógica para eliminar del backend/API
      // Ejemplo: await deleteCierre(cierreAEliminar.id);
    }
    
    // Cerrar modal y limpiar estado
    setModalVisible(false);
    setCierreAEliminar(null);
  };

  // Función para cancelar la eliminación
  const handleCancelarEliminar = () => {
    setModalVisible(false);
    setCierreAEliminar(null);
  };

  return (
    <View style={styles.container}>
      <HeaderSimple />
      <ScrollView contentContainerStyle={styles.content}>
        <TituloPestania style={styles.title}>Cierres Activos</TituloPestania>
        
        {cierres.length === 0 ? (
          <View style={styles.emptyContainer}>
            <TituloPestania style={styles.emptyText}>
              No hay cierres activos
            </TituloPestania>
          </View>
        ) : (
          cierres.map((cierre) => (
            <CardCierre
              key={cierre.id}
              titulo={cierre.titulo}
              subtitulo={cierre.subtitulo}
              onPressEditar={navegarAEditarCierre}
              onPressEliminar={() => handleMostrarModalEliminar(cierre)}
              style={styles.card}
            />
          ))
        )}
        
        <Boton
          texto="Crear nuevo cierre"
          onPress={navegarACrearCierre}
          variante="primario"
          tamaño="grande"
          ancho="completo"
          estilo={styles.button}
        />
      </ScrollView>

      {/* Menú Inferior */}
      <MenuInf
        homeIcon={<Ionicons name="home-outline" size={28} color="#146BF6" />}
        mapIcon={<Ionicons name="people-outline" size={28} color="#146BF6" />}
        onHomePress={() => console.log("Home pressed")}
        onMapPress={() => console.log("Administradores pressed")}
      />

      {/* Modal de Confirmación */}
      <ModalConfirmacion
        visible={modalVisible}
        titulo="¿Eliminar cierre?"
        mensaje={
          cierreAEliminar
            ? `¿Está seguro que desea eliminar el cierre "${cierreAEliminar.titulo}"? Esta acción no se puede deshacer.`
            : "¿Está seguro que desea eliminar este cierre?"
        }
        textoConfirmar="Sí, eliminar"
        textoCancelar="No, cancelar"
        onConfirmar={handleConfirmarEliminar}
        onCancelar={handleCancelarEliminar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 25,
    paddingHorizontal: 16,
  },
  content: {
    alignItems: "center",
    paddingBottom: 50,
    paddingTop: 10,
  },
  title: {
    marginVertical: 20,
    marginHorizontal: 6,
    alignSelf: "flex-start",
  },
  card: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
  },
});

export default memo(PrincSuper);