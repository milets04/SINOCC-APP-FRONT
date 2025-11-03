import Boton from "@/componentes/atomos/boton";
import TituloPestania from "@/componentes/atomos/tituloPestania";
import CardCierre from "@/componentes/moleculas/cardCierre";
import HeaderSimple from "@/componentes/moleculas/headerSimple";
import ModalConfirmacion from "@/componentes/moleculas/modalConfirmacion";
import { useRouter } from "expo-router";
import React, { memo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

interface Cierre {
  id: string | number;
  titulo: string;
  subtitulo: string[];
}
const router = useRouter();
  
const navegarACrearCierre = () => {
    router.push("/crearCierre");
};

const PrincAdmin = () => {
  // Estado para manejar la lista de cierres
  const [cierres, setCierres] = useState<Cierre[]>([
    {
      id: 1,
      titulo: "Av. América y Tarija",
      subtitulo: ["Zona", "Duración: 2 días", "Motivo: Amago de tuberías"],
    },
    {
      id: 2,
      titulo: "Av. América y Libertador",
      subtitulo: ["Zona", "Duración: 2 días", "Motivo: Amago de tuberías"],
    },
    {
      id: 3,
      titulo: "Mel tonta",
      subtitulo: ["Zona", "Duración: 2 días", "Motivo: Amago de tuberías"],
    },
    {
      id: 4,
      titulo: "Hola como estas",
      subtitulo: ["Zona", "Duración: 2 días", "Motivo: Amago de tuberías"],
    },
    {
      id: 5,
      titulo: "Mel tonta",
      subtitulo: ["Zona", "Duración: 2 días", "Motivo: Amago de tuberías"],
    },
    {
      id: 6,
      titulo: "Mel tonta",
      subtitulo: ["Zona", "Duración: 2 días", "Motivo: Amago de tuberías"],
    },
  ]);

  // Estados para el modal de confirmación
  const [modalVisible, setModalVisible] = useState(false);
  const [cierreAEliminar, setCierreAEliminar] = useState<Cierre | null>(null);

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
              onPressEditar={() => console.log("Editar cierre", cierre.titulo)}
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
        <Boton
          texto="Cerrar Sesión"
          onPress={() => console.log("Cierre de Sesión")}
          variante="primario"
          tamaño="grande"
          ancho="ajustado"
          estilo={styles.button}
        />
      </ScrollView>

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
    paddingTop: 20,
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

export default memo(PrincAdmin);