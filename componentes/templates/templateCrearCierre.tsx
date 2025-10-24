import { SelectOption } from '@/componentes/atomos/selectFormulario';
import TituloPestania from '@/componentes/atomos/tituloPestania';
import FormularioCierre, { FormularioCierreData, UbicacionData } from '@/componentes/moleculas/formularioCierre';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import HeaderSimple from '../moleculas/headerSimple';

interface TemplateCrearCierreProps {
  categorias?: SelectOption[];
  zonas?: SelectOption[];
  onSubmit?: (data: FormularioCierreData) => void;
  onAbrirMapa?: () => void;
}

const TemplateCrearCierre: React.FC<TemplateCrearCierreProps> = ({
  categorias,
  zonas,
  onSubmit,
  onAbrirMapa,
}) => {
  const [ubicacionesSeleccionadas, setUbicacionesSeleccionadas] = useState<UbicacionData[]>([]);

  const handleEliminarUbicacion = (id: string | number) => {
    setUbicacionesSeleccionadas(
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

    if (onSubmit) {
      onSubmit(dataCompleta);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderSimple />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TituloPestania style={styles.titulo}>
          Crear cierre
        </TituloPestania>

        {/* Formulario */}
        <FormularioCierre
          categorias={categorias ?? []}
          zonas={zonas ?? []}
          onAbrirMapa={onAbrirMapa ?? (() => {})}
          onEliminarUbicacion={handleEliminarUbicacion}
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