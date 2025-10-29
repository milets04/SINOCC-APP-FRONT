import { SelectOption } from '@/componentes/atomos/selectFormulario';
import TituloPestania from '@/componentes/atomos/tituloPestania';
import FormularioCierre, { FormularioCierreData, UbicacionData } from '@/componentes/moleculas/formularioCierre';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import HeaderSimple from '../moleculas/headerSimple';
interface TemplateCrearCierreProps {
  categorias?: SelectOption[];
  zonas?: SelectOption[];
  onSubmit?: (data: FormularioCierreData) => void;
  ubicaciones: UbicacionData[]; 
  setUbicaciones: React.Dispatch<React.SetStateAction<UbicacionData[]>>;
}

const TemplateCrearCierre: React.FC<TemplateCrearCierreProps> = ({
  categorias,
  zonas,
  onSubmit,
  ubicaciones, 
  setUbicaciones, 
}) => {
  const router = useRouter(); 
  
  //¡ELIMINADO! Ya no usamos el hook aquí
  // const { ubicaciones: ubicacionesSeleccionadas, setUbicaciones } = useUbicaciones();
  const ubicacionesSeleccionadas = ubicaciones;
  const handleEliminarUbicacion = (id: string | number) => {
    setUbicaciones(
      ubicacionesSeleccionadas.filter((ub) => ub.id !== id)
    );
  };

  const handleAbrirMapa = () => {
    router.push('/seleccionarMapa'); 
  };

  const handleSubmit = (data: FormularioCierreData) => {
    if (ubicacionesSeleccionadas.length === 0) {
      alert('Por favor agregue al menos una ubicación');
      return;
    }
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
          onAbrirMapa={handleAbrirMapa} 
          onEliminarUbicacion={handleEliminarUbicacion} 
          ubicacionesSeleccionadas={ubicacionesSeleccionadas} 
          onSubmit={handleSubmit}
          tituloBoton="Crear"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5FS',
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
