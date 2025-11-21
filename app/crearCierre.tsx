import { SelectOption } from '@/componentes/atomos/selectFormulario';
import { FormularioCierreData } from '@/componentes/moleculas/formularioCierre';
import TemplateCrearCierre from '@/componentes/templates/templateCrearCierre';
import { useAuth } from '@/contexto/autenticacion';
import { useUbicaciones } from '@/contexto/ubicaciones';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

const API_URL = 'https://sinocc-backend.onrender.com/api';

console.log('🌐 API Configurada:', API_URL);

const categoriasOptions: SelectOption[] = [
  { label: 'Bajo', value: 'BAJO' },
  { label: 'Medio', value: 'MEDIO' },
  { label: 'Alto', value: 'ALTO' },
];

interface ZonaAPI {
  id: number;
  nombreZona: string;
}

export default function PantallaCrearCierre() {
  const router = useRouter();
  const { token } = useAuth(); 
  const [zonasOptions, setZonasOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ubicaciones: ubicacionesSeleccionadas, setUbicaciones } = useUbicaciones();

  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const response = await fetch(`${API_URL}/zonas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
          },
        });
        
        const responseData = await response.json();

        console.log("Respuesta completa de /zonas:", JSON.stringify(responseData, null, 2));
        if (response.ok && responseData.datos && Array.isArray(responseData.datos)) {
          
          const zonasData: ZonaAPI[] = responseData.datos; 
          
          const opcionesFormateadas = zonasData.map((zona) => ({
            label: zona.nombreZona,
            value: zona.id,
          }));
          
          setZonasOptions(opcionesFormateadas);

        } else {
          throw new Error(responseData.mensaje || 'Respuesta inesperada del servidor');
        }

      } catch (error: any) {
        console.error("Error al cargar las zonas:", error);
        Alert.alert("Error", `No se pudieron cargar las zonas: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchZonas();
  }, [token]); 

  const handleFormSubmit = async (data: FormularioCierreData) => {
    const payload: any = {
      categoria: data.categoria.toString(),
      lugarCierre: data.lugarCierre,
      idZona: Number(data.zona),
      descripcion: data.motivo,
      ubicaciones: data.ubicaciones.map(ub => ({
        latitud: ub.latitud,
        longitud: ub.longitud,
      })),
    };

    if (data.fechaInicio && data.fechaFin) {
      payload.fechaInicio = data.fechaInicio;
      payload.fechaFin = data.fechaFin;
    }

    if (data.horaInicio && data.horaFin) {
      payload.horaInicio = data.horaInicio;
      payload.horaFin = data.horaFin;
    }

    try {
      console.log("Enviando al backend:", JSON.stringify(payload, null, 2));

      const response = await fetch(`${API_URL}/cierres`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("Respuesta no JSON:", responseText);
        throw new Error(`Error ${response.status}: Respuesta no válida del servidor`);
      }

      console.log("Respuesta del backend:", JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        throw new Error(responseData.mensaje || 'Error al crear el cierre');
      }

      Alert.alert('Éxito', '¡Cierre creado con éxito!');
      setUbicaciones([]);
      router.back();

    } catch (error: any) {
      console.error("Error al crear el cierre:", error);
      Alert.alert("Error", `No se pudo crear el cierre: ${error.message}`);
    }
  };


  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#146BF6" />
      </View>
    );
  }

  return (
    <TemplateCrearCierre
      categorias={categoriasOptions}
      zonas={zonasOptions}
      onSubmit={handleFormSubmit}
    />
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});