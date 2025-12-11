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

// ✅ NUEVA FUNCIÓN: Calcular nivel del cierre
const calcularNivelCierre = (
  fechaInicio: string,
  horaInicio: string,
  fechaFin: string,
  horaFin: string
): { nivel: 'Bajo' | 'Medio' | 'Alto' | null; horas: number; dias: number; error: string | null } => {
  
  if (!fechaInicio || !horaInicio || !fechaFin || !horaFin) {
    return { nivel: null, horas: 0, dias: 0, error: 'Faltan datos de fecha u hora' };
  }

  try {
    // Combinar fecha y hora
    const inicio = new Date(`${fechaInicio}T${horaInicio}:00`);
    const fin = new Date(`${fechaFin}T${horaFin}:00`);

    // Validar que las fechas sean válidas
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      return { nivel: null, horas: 0, dias: 0, error: 'Fechas u horas inválidas' };
    }

    // Calcular diferencia en milisegundos
    const diferenciaMs = fin.getTime() - inicio.getTime();
    
    // Validar que la fecha/hora fin sea posterior a la de inicio
    if (diferenciaMs <= 0) {
      return { nivel: null, horas: 0, dias: 0, error: 'La fecha/hora de fin debe ser posterior a la de inicio' };
    }

    // Convertir a horas y días
    const horas = diferenciaMs / (1000 * 60 * 60);
    const dias = horas / 24;

    // Validar duración mínima de 1 hora
    if (horas < 1) {
      return { nivel: null, horas, dias, error: 'El cierre debe tener una duración mínima de 1 hora' };
    }

    // Determinar nivel según las reglas
    // Bajo: 1 hora a 24 horas (1 día)
    // Medio: más de 24 horas hasta 144 horas (6 días)
    // Alto: más de 144 horas (más de 6 días)
    let nivel: 'Bajo' | 'Medio' | 'Alto';
    
    if (horas >= 1 && horas <= 24) {
      nivel = 'Bajo';
    } else if (horas > 24 && horas <= 144) { // 144 horas = 6 días
      nivel = 'Medio';
    } else {
      nivel = 'Alto';
    }

    return { nivel, horas, dias, error: null };
    
  } catch (error) {
    console.error('Error al calcular nivel:', error);
    return { nivel: null, horas: 0, dias: 0, error: 'Error al calcular el nivel del cierre' };
  }
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
  nivel?: 'Bajo' | 'Medio' | 'Alto'; // ✅ NUEVO: Campo calculado automáticamente
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

  // ✅ NUEVO: Estado para mostrar el nivel en tiempo real
  const [nivelInfo, setNivelInfo] = useState<{
    nivel: 'Bajo' | 'Medio' | 'Alto';
    duracion: string;
  } | null>(null);

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

  // ✅ NUEVO: Calcular nivel en tiempo real cuando cambian fechas/horas
  useEffect(() => {
    const { fechaInicio, horaInicio, fechaFin, horaFin } = formData;
    
    if (fechaInicio && horaInicio && fechaFin && horaFin) {
      const resultado = calcularNivelCierre(fechaInicio, horaInicio, fechaFin, horaFin);
      
      if (resultado.nivel && !resultado.error) {
        const duracion = resultado.dias >= 1 
          ? `${resultado.dias.toFixed(1)} día${resultado.dias >= 2 ? 's' : ''}` 
          : `${resultado.horas.toFixed(1)} hora${resultado.horas >= 2 ? 's' : ''}`;
        
        setNivelInfo({
          nivel: resultado.nivel,
          duracion: duracion
        });
      } else {
        setNivelInfo(null);
      }
    } else {
      setNivelInfo(null);
    }
  }, [formData.fechaInicio, formData.horaInicio, formData.fechaFin, formData.horaFin]);

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

    // Validación de campos requeridos
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

    if (!hasDatePair || !hasHourPair) {
      Alert.alert('Error de Duración', 'Debe especificar fecha de inicio, fecha de fin, hora de inicio y hora de fin.');
      return;
    }

    // ✅ NUEVA VALIDACIÓN: Calcular y validar el nivel del cierre
    const resultado = calcularNivelCierre(fechaInicio, horaInicio, fechaFin, horaFin);
    
    if (resultado.error || !resultado.nivel) {
      Alert.alert('Error de Duración', resultado.error || 'No se pudo calcular el nivel del cierre.');
      return;
    }

    if (ubicacionesSeleccionadas.length === 0) {
      Alert.alert('Error', 'Por favor agregue al menos una ubicación');
      return;
    }

    // ✅ NUEVO: Agregar el nivel calculado a los datos
    const dataCompleta: FormularioCierreData = {
      ...formData,
      nivel: resultado.nivel,
      ubicaciones: ubicacionesSeleccionadas,
    };

    console.log(`✅ Cierre validado - Nivel: ${resultado.nivel}, Duración: ${resultado.dias.toFixed(2)} días (${resultado.horas.toFixed(1)} horas)`);
    
    // Ejecutar onSubmit
    onSubmit(dataCompleta);

    // ✅ NUEVO: Limpiar el formulario después de enviar (solo para crear, no para editar)
    if (tituloBoton === 'Crear') {
      limpiarFormulario();
    }
  };

  // ✅ NUEVA FUNCIÓN: Limpiar todos los campos del formulario
  const limpiarFormulario = () => {
    setFormData({
      categoria: '',
      lugarCierre: '',
      zona: '',
      horaInicio: '',
      horaFin: '',
      fechaInicio: '',
      fechaFin: '',
      motivo: '',
      ubicaciones: [],
    });
    setNivelInfo(null);
  };

  const handleAbrirMapa = () => {
    if (onGuardarDatosTemp) {
      onGuardarDatosTemp(formData);
    }
    onAbrirMapa();
  };

  // ✅ NUEVA FUNCIÓN: Obtener color según el nivel
  const getNivelColor = (nivel: 'Bajo' | 'Medio' | 'Alto') => {
    switch (nivel) {
      case 'Bajo':
        return '#28a745'; // Verde
      case 'Medio':
        return '#ffc107'; // Amarillo/Naranja
      case 'Alto':
        return '#dc3545'; // Rojo
      default:
        return '#6c757d'; // Gris
    }
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

      {/* ✅ NUEVO: Indicador de nivel del cierre */}
      {nivelInfo && (
        <View style={[styles.nivelIndicador, { borderColor: getNivelColor(nivelInfo.nivel) }]}>
          <View style={styles.nivelContenido}>
            <Text style={styles.nivelLabel}>Nivel del cierre:</Text>
            <Text style={[styles.nivelValor, { color: getNivelColor(nivelInfo.nivel) }]}>
              {nivelInfo.nivel}
            </Text>
          </View>
          <Text style={styles.nivelDuracion}>Duración: {nivelInfo.duracion}</Text>
        </View>
      )}

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
  // ✅ NUEVOS ESTILOS: Indicador de nivel
  nivelIndicador: {
    width: 310,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  nivelContenido: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nivelLabel: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  nivelValor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nivelDuracion: {
    fontSize: 13,
    color: '#666666',
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