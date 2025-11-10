import { SelectOption } from '@/componentes/atomos/selectFormulario';
import TituloPestania from '@/componentes/atomos/tituloPestania';
import FormularioCierre, { FormularioCierreData } from '@/componentes/moleculas/formularioCierre';
import HeaderSimple from '@/componentes/moleculas/headerSimple';
import { useUbicaciones } from '@/contexto/ubicaciones';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

interface TemplateCrearCierreProps {
  categorias?: SelectOption[];
  zonas?: SelectOption[];
  onSubmit?: (data: FormularioCierreData) => void;
}

const TemplateCrearCierre: React.FC<TemplateCrearCierreProps> = ({
  categorias,
  zonas,
  onSubmit,
}) => {
  const router = useRouter();
  const { ubicaciones, setUbicaciones, datosFormularioTemp, setDatosFormularioTemp } = useUbicaciones();

  const handleEliminarUbicacion = (id: string | number) => {
    setUbicaciones(ubicaciones.filter((ub) => ub.id !== id));
  };

  const handleGuardarDatosTemp = (datosActuales: FormularioCierreData) => {
    // Guardar los datos actuales del formulario
    setDatosFormularioTemp({
      categoria: datosActuales.categoria,
      lugarCierre: datosActuales.lugarCierre,
      zona: datosActuales.zona,
      horaInicio: datosActuales.horaInicio,
      horaFin: datosActuales.horaFin,
      fechaInicio: datosActuales.fechaInicio,
      fechaFin: datosActuales.fechaFin,
      motivo: datosActuales.motivo,
    });
  };

  const handleAbrirMapa = () => {
    router.push('/seleccionarMapa');
  };

  const handleSubmit = (data: FormularioCierreData) => {
    if (ubicaciones.length === 0) {
      alert('Por favor agregue al menos una ubicación');
      return;
    }
    const dataCompleta = {
      ...data,
      ubicaciones: ubicaciones,
    };

    if (onSubmit) {
      onSubmit(dataCompleta);
      setDatosFormularioTemp(null);
      setUbicaciones([]);
    }
  };

  useEffect(() => {
      if (!datosFormularioTemp) {
    setUbicaciones([]);
  }
  }, []);

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
          onGuardarDatosTemp={handleGuardarDatosTemp}
          onEliminarUbicacion={handleEliminarUbicacion}
          ubicacionesSeleccionadas={ubicaciones}
          onSubmit={handleSubmit}
          tituloBoton="Crear"
          datosIniciales={datosFormularioTemp || undefined}
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

export default TemplateCrearCierre;