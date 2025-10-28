import { SelectOption } from '@/componentes/atomos/selectFormulario';
import TituloPestania from '@/componentes/atomos/tituloPestania';
import FormularioCierre, { FormularioCierreData } from '@/componentes/moleculas/formularioCierre';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import HeaderSimple from '../moleculas/headerSimple';

// 1. Importa el hook del Contexto y el router
import { useUbicaciones } from '@/contexto/ubicaciones';
import { useRouter } from 'expo-router';

// (La interfaz que recibes puede simplificarse, pero la dejamos por ahora)
interface TemplateCrearCierreProps {
  categorias?: SelectOption[];
  zonas?: SelectOption[];
  onSubmit?: (data: FormularioCierreData) => void;
  // onAbrirMapa?: () => void; // Ya no necesitamos recibir esto
}

const TemplateCrearCierre: React.FC<TemplateCrearCierreProps> = ({
  categorias,
  zonas,
  onSubmit,
}) => {
  const router = useRouter(); // 2. Hook de navegación
  
  // 3. Obtenemos el estado y el setter del Contexto
  // (Renombramos 'ubicaciones' a 'ubicacionesSeleccionadas' para que coincida con tu código)
  const { ubicaciones: ubicacionesSeleccionadas, setUbicaciones } = useUbicaciones();

  // 4. Tu lógica de eliminar ahora modifica el Contexto
  const handleEliminarUbicacion = (id: string | number) => {
    setUbicaciones(
      ubicacionesSeleccionadas.filter((ub) => ub.id !== id)
    );
  };

  // 5. Esta es la función que pasaremos al formulario
  const handleAbrirMapa = () => {
    router.push('/seleccionarMapa'); // Navega a la nueva pantalla
  };

  const handleSubmit = (data: FormularioCierreData) => {
    if (ubicacionesSeleccionadas.length === 0) {
      alert('Por favor agregue al menos una ubicación');
      return;
    }

    // Tu lógica de submit sigue igual
    const dataCompleta = {
      ...data,
      ubicaciones: ubicacionesSeleccionadas,
    };

    if (onSubmit) {
      onSubmit(dataCompleta);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderSimple onPressRoute="/superAdmin"/>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TituloPestania style={styles.titulo}>
          Crear cierre
        </TituloPestania>

        <FormularioCierre
          categorias={categorias ?? []}
          zonas={zonas ?? []}
          onAbrirMapa={handleAbrirMapa} // 6. Pasamos la nueva función de navegación
          onEliminarUbicacion={handleEliminarUbicacion} // Pasa la función de eliminar (actualiza el contexto)
          ubicacionesSeleccionadas={ubicacionesSeleccionadas} // 7. Pasa las ubicaciones del contexto
          onSubmit={handleSubmit}
          tituloBoton="Crear"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// ... tus estilos siguen igual
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  titulo: {
    marginBottom: 20,
  },
});

export default TemplateCrearCierre;