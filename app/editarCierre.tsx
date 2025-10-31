import { SelectOption } from '@/componentes/atomos/selectFormulario';
import { FormularioCierreData } from '@/componentes/moleculas/formularioCierre';
import TemplateEditarCierre from '@/componentes/templates/templateEditarCierre';
import { useAuth } from '@/contexto/autenticacion';
import { useUbicaciones } from '@/contexto/ubicaciones';
import Constants from 'expo-constants';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

const obtenerApiUrl = () => { 
  try {
    const host =
      Constants?.expoConfig?.hostUri ||
      Constants?.manifest2?.extra?.expoClient?.hostUri;

    if (host) {
      const ip = host.split(':')[0]; 
      const apiUrl = `http://${ip}:3000/api`;
      console.log('🌐 API URL detectada (editarCierre):', apiUrl);
      return apiUrl;
    }
  } catch (error) {
    console.warn('⚠️ No se pudo detectar la IP local automáticamente.');
  }
  console.log('🌐 Usando localhost como fallback');
  return 'http://localhost:3000/api';
};

const API_URL = obtenerApiUrl(); 

const categoriasOptions: SelectOption[] = [
  { label: 'Bajo', value: 'BAJO' },
  { label: 'Medio', value: 'MEDIO' },
  { label: 'Alto', value: 'ALTO' },
];

interface ZonaAPI {
  id: number;
  nombreZona: string;
}

export default function EditarCierre() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { token } = useAuth(); 
  const [zonasOptions, setZonasOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [datosIniciales, setDatosIniciales] = useState<FormularioCierreData>();
  const { ubicaciones: ubicacionesSeleccionadas, setUbicaciones } = useUbicaciones();

  const cierreId = params.cierreId?.toString();

  // 🔹 Obtener zonas
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


  useEffect(() => {
    setDatosIniciales({
      categoria: params.categoria?.toString() ?? '',
      zona: params.idZona?.toString() ?? '',
      lugarCierre: params.lugarCierre?.toString() ?? '',
      fechaInicio: params.fechaInicio?.toString() ?? '',
      fechaFin: params.fechaFin?.toString() ?? '',
      motivo: params.descripcion?.toString() ?? '',
      ubicaciones: [], // para no generar bucle
    });
  }, []);


  const handleFormSubmit = async (data: FormularioCierreData) => {
    if (!cierreId) {
      Alert.alert("Error", "ID del cierre no especificado.");
      return;
    }

    const payload = {
      categoria: data.categoria.toString(),
      lugarCierre: data.lugarCierre,
      idZona: Number(data.zona),
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
      descripcion: data.motivo,
      ubicaciones: data.ubicaciones.map(ub => ({
        latitud: ub.latitud,
        longitud: ub.longitud,
      })),
    };

    try {
      console.log("Editando cierre ID:", cierreId);
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(`${API_URL}/cierres/${cierreId}`, {
        method: 'PUT', // PUT para actu
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.mensaje || 'Error al actualizar el cierre');
      }

      Alert.alert('Éxito', 'Cierre actualizado correctamente');
      router.back();

    } catch (error: any) {
      console.error("Error al guardar el cierre:", error);
      Alert.alert("Error", `No se pudo guardar el cierre: ${error.message}`);
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
    <TemplateEditarCierre
      categorias={categoriasOptions}
      zonas={zonasOptions}
      datosIniciales={datosIniciales}
      onSubmit={handleFormSubmit}
      ubicaciones={ubicacionesSeleccionadas}
      setUbicaciones={setUbicaciones}
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
