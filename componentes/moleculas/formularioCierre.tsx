import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Boton from '../atomos/boton';
import DescripcionTitulo from '../atomos/descripcionTitulo';
import Input from '../atomos/input';
import Select, { SelectOption } from '../atomos/selectFormulario';
import ItemUbicacion from './itemUbicacionCierre';

export interface UbicacionData {
  id: string | number;
  direccion: string;
  latitud: number;
  longitud: number;
}

export interface FormularioCierreData {
  categoria: string | number;
  lugarCierre: string;
  zona: string | number;
  fechaInicio: string;
  fechaFin: string;
  motivo: string;
  ubicaciones: UbicacionData[];
}

interface FormularioCierreProps {
  categorias: SelectOption[];
  zonas: SelectOption[];
  onSubmit: (data: FormularioCierreData) => void;
  onAbrirMapa: () => void;
  ubicacionesSeleccionadas?: UbicacionData[];
  onEliminarUbicacion?: (id: string | number) => void;
  tituloBoton?: string;
  datosIniciales?: Partial<FormularioCierreData>;
}

const FormularioCierre: React.FC<FormularioCierreProps> = ({
  categorias,
  zonas,
  onSubmit,
  onAbrirMapa,
  ubicacionesSeleccionadas = [],
  onEliminarUbicacion,
  tituloBoton = 'Crear',
  datosIniciales,
}) => {
  const [formData, setFormData] = useState<FormularioCierreData>({
    categoria: datosIniciales?.categoria || '',
    lugarCierre: datosIniciales?.lugarCierre || '',
    zona: datosIniciales?.zona || '',
    fechaInicio: datosIniciales?.fechaInicio || '',
    fechaFin: datosIniciales?.fechaFin || '',
    motivo: datosIniciales?.motivo || '',
    ubicaciones: datosIniciales?.ubicaciones || [],
  });

  const handleSubmit = () => {
    // Validación básica
    if (!formData.categoria || !formData.lugarCierre || !formData.zona || 
        !formData.fechaInicio || !formData.fechaFin || !formData.motivo) {
      alert('Por favor complete todos los campos');
      return;
    }

    if (ubicacionesSeleccionadas.length === 0) {
      alert('Por favor agregue al menos una ubicación');
      return;
    }

    const dataCompleta = {
      ...formData,
      ubicaciones: ubicacionesSeleccionadas,
    };

    onSubmit(dataCompleta);
  };

  return (
    <View style={styles.container}>
      {/* Categoría */}
      <Select
        width={310}
        height={47}
        placeholder="Categoría"
        options={categorias}
        value={formData.categoria}
        onValueChange={(value) => setFormData({ ...formData, categoria: value })}
      />

      {/* Lugar del cierre */}
      <Input
        width={310}
        height={47}
        placeholder="Lugar del cierre"
        value={formData.lugarCierre}
        onChangeText={(text) => setFormData({ ...formData, lugarCierre: text })}
      />

      {/* Zona */}
      <Select
        width={310}
        height={47}
        placeholder="Zona"
        options={zonas}
        value={formData.zona}
        onValueChange={(value) => setFormData({ ...formData, zona: value })}
      />

      {/* Fila: Fecha Inicio y Fecha Fin */}
      <View style={styles.filaFechas}>
        <Input
          width={152}
          height={47}
          placeholder="Fecha inicio"
          value={formData.fechaInicio}
          onChangeText={(text) => setFormData({ ...formData, fechaInicio: text })}
        />
        
        <Input
          width={152}
          height={47}
          placeholder="Fecha fin"
          value={formData.fechaFin}
          onChangeText={(text) => setFormData({ ...formData, fechaFin: text })}
        />
      </View>

      {/* Motivo */}
      <Input
        width={310}
        height={77}
        placeholder="Motivo"
        value={formData.motivo}
        onChangeText={(text) => setFormData({ ...formData, motivo: text })}
        multiline
        textAlignVertical="top"
        style={styles.motivoInput}
      />

      {/* Sección: Agregar ubicación */}
      <View style={styles.seccionUbicacion}>
        <View style={styles.headerUbicacion}>
          <DescripcionTitulo texto="Agregar ubicación" />
          
          <Boton
            texto="ABRIR MAPA"
            onPress={onAbrirMapa}
            variante="primario"
            estilo={styles.botonMapa}
            estiloTexto={styles.textoBotonMapa}
          />
        </View>

        {/* Lista de ubicaciones con scroll */}
        <ScrollView 
          style={styles.contenedorUbicaciones}
          contentContainerStyle={styles.listaUbicaciones}
          showsVerticalScrollIndicator={true}
        >
          {ubicacionesSeleccionadas.length === 0 ? (
            <Text style={styles.textoVacio}>
              No hay ubicaciones agregadas
            </Text>
          ) : (
            ubicacionesSeleccionadas.map((ubicacion) => (
              <ItemUbicacion
                key={ubicacion.id}
                direccion={ubicacion.direccion}
                onDelete={() => onEliminarUbicacion && onEliminarUbicacion(ubicacion.id)}
              />
            ))
          )}
        </ScrollView>
      </View>

      {/* Botón Crear/Guardar */}
      <View style={styles.botonContainer}>
        <Boton
          texto={tituloBoton}
          onPress={handleSubmit}
          variante="primario"
          estilo={styles.botonCrear}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  filaFechas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 310,
    gap: 6,
  },
  motivoInput: {
    paddingTop: 12,
  },
  seccionUbicacion: {
    width: 314,
    gap: 12,
  },
  headerUbicacion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  botonMapa: {
    width: 152,
    height: 47,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  textoBotonMapa: {
    fontSize: 14,
  },
  contenedorUbicaciones: {
    width: 314,
    height: 141,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  listaUbicaciones: {
    padding: 8,
    gap: 8,
  },
  textoVacio: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 14,
    marginTop: 50,
  },
  botonContainer: {
    width: 310,
    alignItems: 'center',
    marginTop: 8,
  },
  botonCrear: {
    width: 289,
    height: 54,
  },
});

export default FormularioCierre;