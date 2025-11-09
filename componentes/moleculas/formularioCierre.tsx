import Boton from '@/componentes/atomos/boton';
import CalendarioPersonalizado from '@/componentes/atomos/calendario';
import DescripcionTitulo from '@/componentes/atomos/descripcionTitulo';
import Horas from '@/componentes/atomos/horas';
import Input from '@/componentes/atomos/input';
import Select, { SelectOption } from '@/componentes/atomos/selectFormulario';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ItemUbicacion from './itemUbicacionCierre';

const getTodayNormalized = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  return today;
};

const parseISODate = (dateString: string): Date => {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return getTodayNormalized(); 
  }
  const parts = dateString.split('-');
  return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
};

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
  horaInicio: string; 
  horaFin: string; 
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
  onGuardarDatosTemp?: (datos: FormularioCierreData) => void; 
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
  onGuardarDatosTemp, 
}) => {
  const [formData, setFormData] = useState<FormularioCierreData>({
    categoria: datosIniciales?.categoria || '',
    lugarCierre: datosIniciales?.lugarCierre || '',
    zona: datosIniciales?.zona || '',
    horaInicio: datosIniciales?.horaInicio || '',
    horaFin: datosIniciales?.horaFin || '',
    fechaInicio: datosIniciales?.fechaInicio || '',
    fechaFin: datosIniciales?.fechaFin || '',
    motivo: datosIniciales?.motivo || '',
    ubicaciones: datosIniciales?.ubicaciones || [],
  });

  useEffect(() => {
    if (datosIniciales) {
      setFormData((prev) => ({
        ...prev,
        categoria: datosIniciales.categoria || prev.categoria,
        lugarCierre: datosIniciales.lugarCierre || prev.lugarCierre,
        zona: datosIniciales.zona || prev.zona,
        horaInicio: datosIniciales.horaInicio || prev.horaInicio,
        horaFin: datosIniciales.horaFin || prev.horaFin,
        fechaInicio: datosIniciales.fechaInicio || prev.fechaInicio,
        fechaFin: datosIniciales.fechaFin || prev.fechaFin,
        motivo: datosIniciales.motivo || prev.motivo,
        ubicaciones: datosIniciales.ubicaciones || prev.ubicaciones,
      }));
    }
  }, [datosIniciales]);

  useEffect(() => {
    if (ubicacionesSeleccionadas) {
      setFormData((prev) => ({
        ...prev,
        ubicaciones: ubicacionesSeleccionadas,
      }));
    }
  }, [ubicacionesSeleccionadas]);

  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFinPicker, setShowFinPicker] = useState(false);

  const handleSelectFechaInicio = (date: string) => {
    setShowInicioPicker(false); 
    if (formData.fechaFin && parseISODate(date) > parseISODate(formData.fechaFin)) {
      setFormData({ ...formData, fechaInicio: date, fechaFin: '' });
    } else {
      setFormData({ ...formData, fechaInicio: date });
    }
  };

  const handleSelectFechaFin = (date: string) => {
    setShowFinPicker(false); 
    if (formData.fechaInicio && parseISODate(date) < parseISODate(formData.fechaInicio)) {
      Alert.alert("Error", "La fecha de fin no puede ser anterior a la fecha de inicio.");
      return;
    }
    setFormData({ ...formData, fechaFin: date });
  };

  const handleSubmit = () => {
    const { categoria, lugarCierre, zona, motivo, fechaInicio, fechaFin, horaInicio, horaFin } = formData;

    if (!categoria || !lugarCierre || !zona || !motivo) {
      Alert.alert('Error', 'Por favor complete todos los campos (Categoría, Lugar, Zona, Motivo).');
      return;
    }

    const hasDatePair = !!fechaInicio && !!fechaFin;
    const hasHourPair = !!horaInicio && !!horaFin;
    const hasPartialDate = (!!fechaInicio && !fechaFin) || (!fechaInicio && !!fechaFin);
    const hasPartialHour = (!!horaInicio && !horaFin) || (!horaInicio && !!horaFin);

    if (hasPartialDate) {
      Alert.alert('Error de Fechas', 'Si selecciona una fecha, debe seleccionar ambas (inicio y fin).');
      return;
    }
    if (hasPartialHour) {
      Alert.alert('Error de Horas', 'Si selecciona una hora, debe seleccionar ambas (inicio y fin).');
      return;
    }

    if (!hasDatePair && !hasHourPair) {
      Alert.alert('Error de Duración', 'Debe especificar un rango de fechas O un rango de horas para el cierre.');
      return;
    }

    if (hasDatePair && parseISODate(fechaFin) < parseISODate(fechaInicio)) {
      Alert.alert("Error de Fechas", "La fecha de fin no puede ser anterior a la fecha de inicio.");
      return;
    }
    
    if (hasHourPair && (!hasDatePair || fechaInicio === fechaFin)) {
      if (horaFin < horaInicio) {
        Alert.alert("Error de Horas", "La hora de fin no puede ser anterior a la hora de inicio para un cierre en el mismo día.");
        return;
      }
    }

    if (ubicacionesSeleccionadas.length === 0) {
      Alert.alert('Error', 'Por favor agregue al menos una ubicación');
      return;
    }

    const dataCompleta = {
      ...formData,
      ubicaciones: ubicacionesSeleccionadas,
    };
    onSubmit(dataCompleta);
  };
  const handleAbrirMapa = () => {
    if (onGuardarDatosTemp) {
      onGuardarDatosTemp(formData);
    }
    onAbrirMapa();
  };
  return (
    <View style={styles.container}>
      <Select
        width={310}
        height={47}
        placeholder="Categoría"
        options={categorias}
        value={formData.categoria}
        onValueChange={(value) => setFormData({ ...formData, categoria: value })}
      />
      
      <Input
        width={310}
        height={47}
        placeholder="Lugar del cierre"
        value={formData.lugarCierre}
        onChangeText={(text) => setFormData({ ...formData, lugarCierre: text })}
      />

      <Select
        width={310}
        height={47}
        placeholder="Zona"
        options={zonas}
        value={formData.zona}
        onValueChange={(value) => setFormData({ ...formData, zona: value })}
      />
      
      <View style={styles.filaFechas}>
        <Horas
          placeholder="Hora inicio"
          value={formData.horaInicio}
          onValueChange={(time) => setFormData({ ...formData, horaInicio: time })}
          width={152}
          height={47}
        />
        <Horas
          placeholder="Hora fin"
          value={formData.horaFin}
          onValueChange={(time) => setFormData({ ...formData, horaFin: time })}
          width={152}
          height={47}
          disabled={!formData.horaInicio}
        />
      </View>
      
      <View style={styles.filaFechas}>
        <Pressable
          style={styles.fakeInput} 
          onPress={() => setShowInicioPicker(true)}
        >
          <Text style={[styles.fakeInputText, formData.fechaInicio ? styles.fakeInputTextSelected : styles.fakeInputTextPlaceholder]}>
            {formData.fechaInicio || "Fecha inicio"}
          </Text>
        </Pressable>
        <Pressable
          style={styles.fakeInput} 
          onPress={() => {
            if (!formData.fechaInicio) {
              Alert.alert("Aviso", "Por favor, seleccione primero una fecha de inicio.");
            } else {
              setShowFinPicker(true);
            }
          }}
        >
          <Text style={[styles.fakeInputText, formData.fechaFin ? styles.fakeInputTextSelected : styles.fakeInputTextPlaceholder]}>
            {formData.fechaFin || "Fecha fin"}
          </Text>
        </Pressable>
      </View>

      <CalendarioPersonalizado
        visible={showInicioPicker}
        onClose={() => setShowInicioPicker(false)}
        onSelectDate={handleSelectFechaInicio}
        selectedDate={formData.fechaInicio}
        minimumDate={getTodayNormalized()}
        title="Seleccionar fecha de inicio"
      />

      <CalendarioPersonalizado
        visible={showFinPicker}
        onClose={() => setShowFinPicker(false)}
        onSelectDate={handleSelectFechaFin}
        selectedDate={formData.fechaFin}
        minimumDate={parseISODate(formData.fechaInicio)} 
        title="Seleccionar fecha de fin"
      />

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

      <View style={styles.seccionUbicacion}>
         <View style={styles.headerUbicacion}>
           <DescripcionTitulo texto="Agregar ubicación" />
           <Boton
              texto="ABRIR MAPA"
              onPress={handleAbrirMapa}
              variante="primario"
              estilo={styles.botonMapa}
              estiloTexto={styles.textoBotonMapa}
            />
         </View>
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
  
  fakeInput: {
    width: 152,
    height: 47,
    backgroundColor: '#FFFFFF', 
    borderWidth: 1,
    borderColor: '#E0E0E0', 
    borderRadius: 8, 
    paddingHorizontal: 15, 
    justifyContent: 'center', 
  },
  fakeInputText: {
    fontSize: 16, 
  },
  fakeInputTextPlaceholder: {
    color: '#9E9E9E', 
  },
  fakeInputTextSelected: {
    color: '#000000', 
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