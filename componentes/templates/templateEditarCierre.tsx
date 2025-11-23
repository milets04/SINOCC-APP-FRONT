import { SelectOption } from '@/componentes/atomos/selectFormulario';
import TituloPestania from '@/componentes/atomos/tituloPestania';
import FormularioCierre, { FormularioCierreData, UbicacionData } from '@/componentes/moleculas/formularioCierre';
import HeaderSimple from '@/componentes/moleculas/headerSimple';
import { useUbicaciones } from '@/contexto/ubicaciones';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
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
  const { setZonaSeleccionada, setDatosFormularioTemp } = useUbicaciones();
  // ✅ CAMBIADO: Usar directamente las ubicaciones del contexto
  const ubicacionesSeleccionadas = ubicaciones;

  // Establecer la zona seleccionada al cargar los datos iniciales
  useEffect(() => {
    if (datosIniciales?.zona) {
      // Buscar el nombre de la zona en las opciones
      const zonaSeleccionadaObj = zonas?.find(z => z.value === datosIniciales.zona);
      setZonaSeleccionada(zonaSeleccionadaObj?.label || null);
      setDatosFormularioTemp(datosIniciales);
    }
  }, [datosIniciales]);

  const handleAbrirMapa = () => {
    router.push('/seleccionarMapa'); 
  };

  const handleEliminarUbicacion = (id: string | number) => {
    setUbicaciones(
      ubicacionesSeleccionadas.filter((ub) => ub.id !== id)
    );
  };

   const handleGuardarDatosTemp = (datosActuales: FormularioCierreData) => {
    // Actualizar la zona seleccionada cuando cambie
    const zonaSeleccionadaObj = zonas?.find(z => z.value === datosActuales.zona);
    setZonaSeleccionada(zonaSeleccionadaObj?.label || null);
    setDatosFormularioTemp(datosActuales);
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
      <HeaderSimple/>

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
          onGuardarDatosTemp={handleGuardarDatosTemp}
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