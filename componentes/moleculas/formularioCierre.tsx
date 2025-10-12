import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Boton from '../atomos/boton';
import Input from '../atomos/input';
import Select, { SelectOption } from '../atomos/selectFormulario';

export interface FormularioCierreData {
  categoria: string | number;
  callePrincipal: string | number;
  calle: string;
  zona: string;
  latitud: string;
  longitud: string;
  fechaInicio: string;
  fechaFin: string;
  motivo: string;
}

interface FormularioCierreProps {
  categorias: SelectOption[];
  callesPrincipales: SelectOption[];
  onSubmit: (data: FormularioCierreData) => void;
  titulo?: string;
}

const FormularioCierre: React.FC<FormularioCierreProps> = ({
  categorias,
  callesPrincipales,
  onSubmit,
  titulo = 'Crear cierre',
}) => {
  const [formData, setFormData] = useState<FormularioCierreData>({
    categoria: '',
    callePrincipal: '',
    calle: '',
    zona: '',
    latitud: '',
    longitud: '',
    fechaInicio: '',
    fechaFin: '',
    motivo: '',
  });

  const handleSubmit = () => {
    // Validación básica
    const camposRequeridos = Object.entries(formData);
    const camposVacios = camposRequeridos.filter(([_, value]) => !value);
    
    if (camposVacios.length > 0) {
      // Aquí podrías mostrar un alert o toast
      console.log('Por favor complete todos los campos');
      return;
    }

    onSubmit(formData);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Título */}
      <Text style={styles.titulo}>{titulo}</Text>

      {/* Fila: Categoría y Calle Principal */}
      <View style={styles.filaDoble}>
        <Select
          width={147}
          height={47}
          placeholder="Categoría"
          options={categorias}
          value={formData.categoria}
          onValueChange={(value) => setFormData({ ...formData, categoria: value })}
        />
        
        <Select
          width={152}
          height={47}
          placeholder="Calle principal"
          options={callesPrincipales}
          value={formData.callePrincipal}
          onValueChange={(value) => setFormData({ ...formData, callePrincipal: value })}
        />
      </View>

      {/* Calle */}
      <Input
        width={310}
        height={47}
        placeholder="Calle"
        value={formData.calle}
        onChangeText={(text) => setFormData({ ...formData, calle: text })}
      />

      {/* Zona */}
      <Input
        width={310}
        height={47}
        placeholder="Zona"
        value={formData.zona}
        onChangeText={(text) => setFormData({ ...formData, zona: text })}
      />

      {/* Latitud */}
      <Input
        width={310}
        height={47}
        placeholder="Latitud"
        value={formData.latitud}
        onChangeText={(text) => setFormData({ ...formData, latitud: text })}
        keyboardType="numeric"
      />

      {/* Longitud */}
      <Input
        width={310}
        height={47}
        placeholder="Longitud"
        value={formData.longitud}
        onChangeText={(text) => setFormData({ ...formData, longitud: text })}
        keyboardType="numeric"
      />

      {/* Fila: Fecha Inicio y Fecha Fin */}
      <View style={styles.filaDoble}>
        <Input
          width={147}
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

      {/* Botón Crear */}
      <View style={styles.botonContainer}>
        <Boton
          texto="Crear"
          onPress={handleSubmit}
          variante="primario"
          estilo={styles.boton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  filaDoble: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 310,
    gap: 11,
  },
  motivoInput: {
    paddingTop: 12,
  },
  botonContainer: {
    width: 310,
    alignItems: 'center',
    marginTop: 16,
  },
  boton: {
    width: 289,
    height: 50,
  },
});

export default FormularioCierre;