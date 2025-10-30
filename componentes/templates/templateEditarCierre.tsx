import { SelectOption } from '@/componentes/atomos/selectFormulario';
import TituloPestania from '@/componentes/atomos/tituloPestania';
import FormularioCierre, { FormularioCierreData, UbicacionData } from '@/componentes/moleculas/formularioCierre';
import HeaderSimple from '@/componentes/moleculas/headerSimple';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

interface TemplateEditarCierreProps {
  categorias?: SelectOption[];
  zonas?: SelectOption[];
  datosIniciales?: FormularioCierreData;
  onSubmit?: (data: FormularioCierreData) => void;
  ubicaciones: UbicacionData[]; 
  setUbicaciones: React.Dispatch<React.SetStateAction<UbicacionData[]>>;
}

const TemplateEditarCierre: React.FC<TemplateEditarCierreProps> = ({
  categorias,
  zonas,
  datosIniciales,
  onSubmit,
  ubicaciones, 
  setUbicaciones, 
}) => {
  const router = useRouter(); 

  // ✅ CAMBIADO: Usar directamente las ubicaciones del contexto
  const ubicacionesSeleccionadas = ubicaciones;

  const handleAbrirMapa = () => {
    router.push('/seleccionarMapa'); 
  };

  const handleEliminarUbicacion = (id: string | number) => {
    // ✅ CAMBIADO: Usar setUbicaciones de las props (del contexto)
    setUbicaciones(
      ubicacionesSeleccionadas.filter((ub) => ub.id !== id)
    );
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

    onSubmit?.(dataCompleta);
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
          Datos del cierre
        </TituloPestania>

        <FormularioCierre
          categorias={categorias ?? []}
          zonas={zonas ?? []}
          ubicacionesSeleccionadas={ubicacionesSeleccionadas}
          onAbrirMapa={handleAbrirMapa}
          onEliminarUbicacion={handleEliminarUbicacion}
          onSubmit={handleSubmit}
          tituloBoton="Guardar"
          datosIniciales={datosIniciales}
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

export default TemplateEditarCierre;